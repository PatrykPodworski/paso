import { it, expect } from "vitest";
import { businessRanges } from "./mutation-scope.mjs";
it("retains state rules, rendering guards and event handlers while excluding visual copy", () => {
  const source =
    'const View=()=>{const count=1+2;const save=()=>send("Spanish");return <main className={active?"green":"cream"}>{!exam&&<button disabled={!ready} onClick={()=>save()}>Nice copy</button>}{score>=30?"Passed":"Below"}</main>}';
  const ranges = businessRanges(source);
  const covers = (fragment) => {
    const start = source.indexOf(fragment);
    return ranges.some(([a, b]) => a <= start && b >= start + fragment.length);
  };
  for (const fragment of ["1+2", 'send("Spanish")', "!exam", "!ready", "()=>save()", "score>=30"]) {
    expect(covers(fragment), fragment).toBe(true);
  }
  for (const fragment of ['active?"green":"cream"', "Nice copy", '"Passed"']) {
    expect(covers(fragment), fragment).toBe(false);
  }
});
