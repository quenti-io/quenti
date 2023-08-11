import {
  Grid,
  GridItem,
  Heading,
  Skeleton,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import type { RouterOutputs } from "@quenti/trpc";
import { useSession } from "next-auth/react";
import { ClassCard } from "../../components/class-card";

interface ClassesGridProps {
  heading: string;
  isLoading: boolean;
  skeletonCount: number;
  classes: RouterOutputs["recent"]["get"]["classes"];
}

export const ClassesGrid: React.FC<ClassesGridProps> = ({
  heading,
  isLoading,
  skeletonCount,
  classes,
}) => {
  const session = useSession();
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
        {classes.map((class_) => (
          <ClassCard
            key={class_.id}
            id={class_.id}
            name={class_.name}
            data={{
              students: class_._count.members || 0,
              sections: class_._count.sections || 0,
              folders: class_._count.folders || 0,
              studySets: class_._count.studySets || 0,
            }}
            for={class_.as}
          />
        ))}
      </Grid>
    </Stack>
  );
};
