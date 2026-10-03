import { useState } from "react";
import { Eyebrow } from "../design-system/Eyebrow";
import { Panel } from "../design-system/Panel";
import { TextLink } from "../design-system/TextLink";
import { passingGroups } from "../data/progress";
import { sources } from "../data/research";
import { Icon } from "../design-system/Icon";

const tone = (ok: boolean) => (ok ? "bg-[#eaf1e1] text-[#66834f]" : "bg-[#f7e8dc] text-[#b07853]");

export const PassingRule = () => {
  const [scores, setScores] = useState([15, 15, 15, 15]);
  const groups = passingGroups(scores[0], scores[1], scores[2], scores[3]);

  return (
    <Panel className="p-[27px] max-xl:p-[23px] max-md:p-[24px]">
      <Eyebrow>TRY THE PASSING RULE</Eyebrow>
      <h3 className="tracking-[-0.3px] font-serif text-[25px] font-medium m-[9px_0_12px]">
        Does this score pass?
      </h3>
      <p className="leading-[1.7] text-[14px] text-[#768762] mb-[23px]">
        Move the sliders. Both groups must reach 30/50, even if your total is 60 or more.
      </p>
      {["Reading", "Writing", "Listening", "Speaking"].map((s, i) => (
        <label key={s} className="text-[15px] block mb-[16px]">
          <span className="flex justify-between text-[#7b8d6c] text-[14px]">
            {s}
            <b className="font-medium">{scores[i]}/25</b>
          </span>
          <input
            className="h-[7px] mt-[12px] w-full cursor-pointer accent-green-900"
            type="range"
            min="0"
            max="25"
            value={scores[i]}
            onChange={(e) => setScores((v) => v.map((n, j) => (j === i ? +e.target.value : n)))}
          />
        </label>
      ))}
      <div className="passing-groups flex gap-[10px] mt-[22px] [&>div]:flex-1 [&>div]:rounded-[8px] [&>div]:p-[12px] [&>div]:text-center [&_span]:block [&_span]:text-[12px] [&_b]:block [&_b]:text-[20px] [&_b]:mt-[5px] [&_b]:font-medium">
        <div className={tone(groups.group1 >= 30)}>
          <span>Reading + writing</span>
          <b>{groups.group1}/50</b>
        </div>
        <div className={tone(groups.group2 >= 30)}>
          <span>Listening + speaking</span>
          <b>{groups.group2}/50</b>
        </div>
      </div>
      <div
        className={`pass-verdict flex gap-[8px] items-center rounded-[8px] m-[12px_0_16px] p-[12px] text-[13px] [&>svg]:w-[17px] ${tone(groups.pass)}`}
        role="status"
      >
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
