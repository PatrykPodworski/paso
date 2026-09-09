"""Transcribe Spanish locally. The recording is never sent to an audio API."""
import json
import sys
import subprocess

import numpy as np
import torch
import whisper

torch.set_num_threads(4)
# Bound decoding too, so even a very long compressed upload cannot fill memory.
decoded = subprocess.run(["ffmpeg", "-nostdin", "-v", "error", "-i", sys.argv[1],
                          "-t", "601", "-f", "s16le", "-ac", "1", "-ar", "16000", "-"],
                         check=True, capture_output=True, timeout=30)
audio = np.frombuffer(decoded.stdout, np.int16).astype(np.float32) / 32768.0
if len(audio) > 600 * whisper.audio.SAMPLE_RATE:
    raise ValueError("Keep recordings under ten minutes.")
if not len(audio) or float(np.sqrt(np.mean(audio ** 2))) < 0.001:
    print(json.dumps({"text": ""}))
    sys.exit(0)
model = whisper.load_model("small", device="cpu")
result = model.transcribe(audio, language="es", fp16=False, verbose=None,
                          condition_on_previous_text=False, temperature=0)
text = " ".join(segment["text"].strip() for segment in result["segments"]
                if segment["no_speech_prob"] < 0.6)
print(json.dumps({"text": text}, ensure_ascii=False))
