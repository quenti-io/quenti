import { Button, Grid, GridItem } from "@chakra-ui/react";
import { IconPlus } from "@tabler/icons-react";
import { StudySetCard } from "../../components/study-set-card";
import { useFolder } from "../../hooks/use-folder";
import { FolderCreatorOnly } from "./folder-creator-only";

export const FolderSets = () => {
  const folder = useFolder();

  return (
    <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={4}>
      {folder.sets.map((studySet) => (
        <GridItem key={studySet.id}>
          <StudySetCard
            studySet={studySet}
            user={studySet.user}
            numTerms={studySet._count.terms}
          />
        </GridItem>
      ))}
      <FolderCreatorOnly>
        <GridItem>
          <Button leftIcon={<IconPlus />} variant="outline" size="lg">
            Add sets
          </Button>
        </GridItem>
      </FolderCreatorOnly>
    </Grid>
  );
};
