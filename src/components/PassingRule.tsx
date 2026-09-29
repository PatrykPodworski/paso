import { useState } from "react";
import { Eyebrow } from "../design-system/Eyebrow";
import { Panel } from "../design-system/Panel";
import { TextLink } from "../design-system/TextLink";
import { passingGroups } from "../data/progress";
import { sources } from "../data/research";
import { Icon } from "../design-system/Icon";

export const PassingRule = () => {
  const [scores, setScores] = useState([15, 15, 15, 15]);
  const groups = passingGroups(scores[0], scores[1], scores[2], scores[3]);

  return (
    <Panel className="p-[27px] max-desktop:p-[23px] max-tablet:p-[24px]">
      <Eyebrow>TRY THE PASSING RULE</Eyebrow>
      <h3 className="font-(family-name:--serif) text-[25px] font-medium m-[9px_0_12px]">
        Does this score pass?
      </h3>
      <p className="text-[14px] text-[#768762] mb-[23px]">
        Move the sliders. Both groups must reach 30/50, even if your total is 60 or more.
      </p>
      {["Reading", "Writing", "Listening", "Speaking"].map((s, i) => (
        <label key={s} className="score-slider">
          <span>
            {s}
            <b>{scores[i]}/25</b>
          </span>
          <input
            type="range"
            min="0"
            max="25"
            value={scores[i]}
            onChange={(e) => setScores((v) => v.map((n, j) => (j === i ? +e.target.value : n)))}
          />
        </label>
      ))}
      <div className="passing-groups">
        <div className={groups.group1 >= 30 ? "passed" : "below"}>
          <span>Reading + writing</span>
          <b>{groups.group1}/50</b>
        </div>
        <div className={groups.group2 >= 30 ? "passed" : "below"}>
          <span>Listening + speaking</span>
          <b>{groups.group2}/50</b>
        </div>
      </div>
      <div className={`pass-verdict ${groups.pass ? "passed" : "below"}`} role="status">
        <Icon name={groups.pass ? "check" : "info"} />
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
