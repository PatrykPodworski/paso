"""Exercise real transcription decisions; substitute only ffmpeg and Whisper."""
import contextlib
import io
import json
import os
from pathlib import Path
import runpy
import subprocess
import sys
import types
import unittest
from unittest.mock import Mock, patch
import numpy as np

ROOT = Path(__file__).resolve().parents[2]
TARGET = Path(os.environ.get('PASO_TRANSCRIBE_TARGET', ROOT / 'scripts/transcribe.py'))

class TranscriptionTests(unittest.TestCase):
    def setUp(self):
        self.model = Mock()
        self.model.transcribe.return_value = {'segments': [
            {'text': ' Hola, ', 'no_speech_prob': 0.01},
            {'text': 'skip boundary', 'no_speech_prob': 0.6},
            {'text': 'skip silence', 'no_speech_prob': 0.9},
            {'text': ' España. ', 'no_speech_prob': 0.599},
        ]}
        self.whisper = types.SimpleNamespace(audio=types.SimpleNamespace(SAMPLE_RATE=16000), load_model=Mock(return_value=self.model))
        self.torch = types.SimpleNamespace(set_num_threads=Mock())

    def transcribe(self, samples):
        output = io.StringIO()
        with patch.dict(sys.modules, {'torch': self.torch, 'whisper': self.whisper}), patch.object(sys, 'argv', [str(TARGET), '/private/recording.webm']), patch('subprocess.run', return_value=types.SimpleNamespace(stdout=samples.tobytes())) as decode, contextlib.redirect_stdout(output):
            try:
                runpy.run_path(str(TARGET), run_name='__main__')
            except SystemExit as exc:
                self.assertEqual(exc.code, 0)
        return output.getvalue(), decode

    def test_decode_contract_and_spanish_only_local_model(self):
        samples=np.array([32767, -32768, 8192, -8192], dtype=np.int16)
        output, decode=self.transcribe(samples)
        decode.assert_called_once_with(['ffmpeg','-nostdin','-v','error','-i','/private/recording.webm','-t','601','-f','s16le','-ac','1','-ar','16000','-'], check=True,capture_output=True,timeout=30)
        self.torch.set_num_threads.assert_called_once_with(4)
        self.whisper.load_model.assert_called_once_with('small',device='cpu')
        actual=self.model.transcribe.call_args
        np.testing.assert_array_equal(actual.args[0], samples.astype(np.float32)/32768.0)
        self.assertEqual(actual.kwargs,dict(language='es',fp16=False,verbose=None,condition_on_previous_text=False,temperature=0))
        self.assertEqual(json.loads(output), {'text':'Hola, España.'})
        self.assertIn('España',output)

    def test_empty_and_silent_audio_never_loads_a_model(self):
        for samples in [np.array([],dtype=np.int16),np.zeros(100,dtype=np.int16),np.full(100,32,dtype=np.int16),np.full(100,-32,dtype=np.int16)]:
            with self.subTest(size=len(samples)):
                output,_=self.transcribe(samples)
                self.assertEqual(json.loads(output),{'text':''})
                self.whisper.load_model.assert_not_called()

    def test_just_above_silence_threshold_is_transcribed(self):
        self.transcribe(np.full(100,33,dtype=np.int16))
        self.whisper.load_model.assert_called_once()

    def test_ten_minutes_exactly_is_allowed(self):
        self.transcribe(np.full(600*16000,100,dtype=np.int16))
        self.whisper.load_model.assert_called_once()

    def test_one_extra_sample_is_rejected_before_model_loading(self):
        with self.assertRaisesRegex(ValueError,'under ten minutes'):
            self.transcribe(np.full(600*16000+1,100,dtype=np.int16))
        self.whisper.load_model.assert_not_called()

    def test_empty_segments_do_not_invent_speech(self):
        self.model.transcribe.return_value={'segments':[]}
        output,_=self.transcribe(np.full(100,33,dtype=np.int16))
        self.assertEqual(json.loads(output),{'text':''})

    def test_decoding_failure_is_propagated_without_model_use(self):
        with patch.dict(sys.modules,{'torch':self.torch,'whisper':self.whisper}),patch.object(sys,'argv',[str(TARGET),'input']),patch('subprocess.run',side_effect=subprocess.TimeoutExpired('ffmpeg',30)):
            with self.assertRaises(subprocess.TimeoutExpired):runpy.run_path(str(TARGET),run_name='__main__')
        self.whisper.load_model.assert_not_called()

if __name__=='__main__':unittest.main()
