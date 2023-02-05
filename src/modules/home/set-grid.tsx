import {
  Grid,
  GridItem,
  Heading,
  Skeleton,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import type React from "react";
import { StudySetCard } from "../../components/study-set-card";
import type { RouterOutputs } from "../../utils/api";

export interface SetGridProps {
  heading: string;
  isLoading: boolean;
  skeletonCount: number;
  data:
    | RouterOutputs["studySets"]["recent"]
    | RouterOutputs["studySets"]["getOfficial"]
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
        {(data || []).map((studySet) => (
          <GridItem key={studySet.id} h="156px">
            <StudySetCard
              studySet={studySet}
              numTerms={studySet._count.terms}
              user={studySet.user}
              verified={verified}
            />
          </GridItem>
        ))}
      </Grid>
    </Stack>
  );
};
