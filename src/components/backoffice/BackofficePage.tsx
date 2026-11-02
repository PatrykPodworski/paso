import { Eyebrow } from "../../design-system/Eyebrow";
import { PageHeading } from "../../design-system/PageHeading";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import type { Session } from "../practice";
import { audioAssets } from "./audioAssets";
import { AudioTab } from "./AudioTab";
import { exerciseCount } from "./exerciseGroups";
import { ExerciseList } from "./ExerciseList";
import { pictureIds } from "./imageAssets";
import { ImagesTab } from "./ImagesTab";
import { useFlags } from "./useFlags";

type Props = { setSession: Session };

export const BackofficePage = ({ setSession }: Props) => {
  const flags = useFlags();

  const tabs = [
    { value: "exercises", label: "Exercises", count: exerciseCount },
    { value: "audio", label: "Audio", count: audioAssets.length },
    { value: "images", label: "Images", count: pictureIds.length },
  ];

  return (
    <>
      <PageHeading
        eyebrow={
          <Eyebrow variant="page" className="mb-2">
            BACKOFFICE
          </Eyebrow>
        }
        title="Every task, one click away."
        description="Open any task directly, or flag the clips and pictures that need regenerating."
      />
      <Tabs defaultValue="exercises">
        <TabsList>
          {tabs.map((t) => (
            <TabsTrigger key={t.value} value={t.value}>
              {t.label}
              <Badge variant="secondary">{t.count}</Badge>
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="exercises">
          <ExerciseList setSession={setSession} />
        </TabsContent>
        <TabsContent value="audio">
          <AudioTab flags={flags} />
        </TabsContent>
        <TabsContent value="images">
          <ImagesTab flags={flags} />
        </TabsContent>
      </Tabs>
    </>
  );
};
