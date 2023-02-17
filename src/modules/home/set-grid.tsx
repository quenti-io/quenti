import {
  Grid,
  GridItem,
  Heading,
  Skeleton,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { FolderCard } from "../../components/folder-card";
import { StudySetCard } from "../../components/study-set-card";
import type { SetFolderEntity } from "../../interfaces/set-folder-entity";
import type { RouterOutputs } from "../../utils/api";

export interface SetGridProps {
  heading: string;
  isLoading: boolean;
  skeletonCount: number;
  data:
    | RouterOutputs["recent"]["get"]
    | {
        sets: RouterOutputs["studySets"]["getOfficial"];
        folders: RouterOutputs["recent"]["get"]["folders"];
      }
    | undefined;
  verified?: boolean;
}

export const SetGrid: React.FC<SetGridProps> = ({
  heading,
  isLoading,
  skeletonCount,
  data,
  verified = false,
}) => {
  const headingColor = useColorModeValue("gray.600", "gray.400");

  const [items, setItems] = React.useState<SetFolderEntity[]>([]);

  React.useEffect(() => {
    setItems(() => {
      const items = new Array<SetFolderEntity>();

      for (const set of data?.sets || []) {
        items.push({
          ...set,
          type: "set",
          slug: null,
          numItems: set._count.terms,
        });
      }
      for (const folder of data?.folders || []) {
        items.push({
          ...folder,
          type: "folder",
          numItems: folder._count.studySets,
        });
      }

      return items
        .sort((a, b) => {
          const tA = new Date(a.viewedAt || a.createdAt).getTime();
          const tB = new Date(b.viewedAt || b.createdAt).getTime();
          return tB - tA;
        })
        .slice(0, 16);
    });
  }, [data]);

  return (
    <Stack spacing={6}>
      <Heading color={headingColor} size="md">
        {heading}
      </Heading>
      <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={4}>
        {isLoading &&
          Array.from({ length: skeletonCount }).map((_, i) => (
            <GridItem h="156px" key={i}>
              <Skeleton
                rounded="md"
                height="full"
                border="2px"
                borderColor="gray.700"
              />
            </GridItem>
          ))}
        {items.map((item) => (
          <GridItem key={item.id} h="156px">
            {item.type == "set" ? (
              <StudySetCard
                studySet={{ ...item, visibility: item.visibility! }}
                numTerms={item.numItems}
                user={item.user}
                verified={verified}
              />
            ) : (
              <FolderCard
                folder={item}
                numSets={item.numItems}
                user={item.user}
              />
            )}
          </GridItem>
        ))}
      </Grid>
    </Stack>
  );
};
