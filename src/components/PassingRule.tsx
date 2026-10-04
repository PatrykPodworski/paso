import { useState } from "react";
import { Eyebrow } from "../design-system/Eyebrow";
import { Panel } from "../design-system/Panel";
import { TextLink } from "../design-system/TextLink";
import { passingGroups } from "../data/progress";
import { sources } from "../data/research";
import { Icon } from "../design-system/Icon";

const tone = (ok: boolean) => (ok ? "bg-sage-100 text-olive-700" : "bg-sand-100 text-coral-600");

export const PassingRule = () => {
  const [scores, setScores] = useState([15, 15, 15, 15]);
  const groups = passingGroups(scores[0], scores[1], scores[2], scores[3]);

  return (
    <Panel className="p-7 max-xl:p-6">
      <Eyebrow>TRY THE PASSING RULE</Eyebrow>
      <h3 className="tracking-normal font-serif text-2xl font-medium mt-2 mx-0 mb-3">
        Does this score pass?
      </h3>
      <p className="leading-relaxed text-sm text-sage-700 mb-6">
        Move the sliders. Both groups must reach 30/50, even if your total is 60 or more.
      </p>
      {["Reading", "Writing", "Listening", "Speaking"].map((s, i) => (
        <label key={s} className="text-sm block mb-4">
          <span className="flex justify-between text-sage-600 text-sm">
            {s}
            <b className="font-medium">{scores[i]}/25</b>
          </span>
          <input
            className="h-1.5 mt-3 w-full cursor-pointer accent-green-900"
            type="range"
            min="0"
            max="25"
            value={scores[i]}
            onChange={(e) => setScores((v) => v.map((n, j) => (j === i ? +e.target.value : n)))}
          />
        </label>
      ))}
      <div className="passing-groups flex gap-2.5 mt-5">
        {(
          [
            ["Reading + writing", groups.group1],
            ["Listening + speaking", groups.group2],
          ] as const
        ).map(([label, score]) => (
          <div key={label} className={`flex-1 rounded-lg p-3 text-center ${tone(score >= 30)}`}>
            <span className="block text-xs">{label}</span>
            <b className="block text-xl mt-1 font-medium">{score}/50</b>
          </div>
        ))}
      </div>
      <div
        className={`pass-verdict flex gap-2 items-center rounded-lg mt-3 mx-0 mb-4 p-3 text-xs ${tone(groups.pass)}`}
        role="status"
      >
        <Icon name={groups.pass ? "check" : "info"} className="w-4" />
        {groups.pass
          ? "These example scores meet the passing rule."
          : "These example scores do not meet the passing rule."}
      </div>
      <TextLink href={sources[1].url} target="_blank" rel="noreferrer">
        Official scoring rules
        <Icon name="external" size={14} />
      </TextLink>
    </Panel>
  );
};
