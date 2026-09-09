"""Bounded AST mutation runner for the small Python transcription boundary.
Runs every mutation against the same independent unittest suite in an isolated
file. Never modifies production code or loads Whisper. No third-party mutator.
"""
import ast
import copy
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile

ROOT=Path(__file__).resolve().parents[1]
source=ROOT/'scripts/transcribe.py'
tree=ast.parse(source.read_text())
command=[sys.executable,'-m','unittest','discover','-s','tests/python','-q']

def run(target):
    return subprocess.run(command,cwd=ROOT,env={**os.environ,'PASO_TRANSCRIBE_TARGET':str(target)},capture_output=True,text=True,timeout=15)

if run(source).returncode:
    sys.exit('Baseline Python tests failed; refusing to score mutations.')

mutations=[]
for index,node in enumerate(ast.walk(tree)):
    replacement=None
    if isinstance(node,ast.Compare):
        operators={ast.Lt:ast.LtE,ast.Gt:ast.GtE,ast.Eq:ast.NotEq}
        if type(node.ops[0]) in operators:
            replacement=copy.deepcopy(node);replacement.ops[0]=operators[type(node.ops[0])]()
    elif isinstance(node,ast.BoolOp):
        replacement=copy.deepcopy(node);replacement.op=ast.And() if isinstance(node.op,ast.Or) else ast.Or()
    elif isinstance(node,ast.BinOp):
        operators={ast.Mult:ast.Add,ast.Div:ast.Mult,ast.Pow:ast.Mult}
        if type(node.op) in operators:
            replacement=copy.deepcopy(node);replacement.op=operators[type(node.op)]()
    elif isinstance(node,ast.Constant):
        value=node.value
        if isinstance(value,bool):replacement=ast.Constant(not value)
        elif isinstance(value,(int,float)):replacement=ast.Constant(value+1)
        elif isinstance(value,str) and value and not (getattr(node,'lineno',0)==1):replacement=ast.Constant('')
    if replacement is not None:mutations.append((index,node,replacement))

results=[]
with tempfile.TemporaryDirectory(prefix='paso-python-mutation-') as temp:
    target=Path(temp)/'transcribe.py'
    for index,node,replacement in mutations:
        changed=copy.deepcopy(tree)
        original=list(ast.walk(changed))[index]
        class Replace(ast.NodeTransformer):
            def visit(self,current):
                if current is original:return ast.copy_location(copy.deepcopy(replacement),current)
                return super().visit(current)
        changed=ast.fix_missing_locations(Replace().visit(changed))
        target.write_text(ast.unparse(changed)+'\n')
        try:status='Killed' if run(target).returncode else 'Survived'
        except subprocess.TimeoutExpired:status='Timeout'
        if status=='Survived' and ast.unparse(node)=='float(np.sqrt(np.mean(audio ** 2))) < 0.001':
            # sqrt(mean(float32 ** 2)) is float32; its exact Python float value
            # cannot equal the non-representable binary32 threshold 0.001.
            status='Equivalent'
        results.append({'line':node.lineno,'original':ast.unparse(node),'replacement':ast.unparse(replacement),'status':status})

survivors=[r for r in results if r['status']=='Survived']
killed=sum(r['status']=='Killed' for r in results)
timeouts=sum(r['status']=='Timeout' for r in results)
equivalent=sum(r['status']=='Equivalent' for r in results)
report={'source':str(source.relative_to(ROOT)),'mutants':results,'total':len(results),'killed':killed,'timeouts':timeouts,'survived':len(survivors),'equivalent':equivalent,'rawScore':round(100*(killed+timeouts)/len(results),2),'scoreExcludingReviewedEquivalents':round(100*(killed+timeouts)/(len(results)-equivalent),2)}
path=ROOT/'reports/mutation/python.json';path.parent.mkdir(parents=True,exist_ok=True);path.write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({k:v for k,v in report.items() if k!='mutants'}))
for survivor in survivors:print(json.dumps(survivor))
sys.exit(bool(survivors))
