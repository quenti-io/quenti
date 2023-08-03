import {
  Flex,
  SimpleGrid,
  Skeleton,
  SkeletonText,
  Stack,
  Text,
} from "@chakra-ui/react";
import { StudySetCard } from "../../components/study-set-card";

export interface EntityGroupProps {
  heading: string;
  isLoaded?: boolean;
  numSkeletons?: number;
}

export const EntityGroup: React.FC<
  React.PropsWithChildren<EntityGroupProps>
> = ({ heading, isLoaded = true, numSkeletons = 3, children }) => {
  return (
    <Stack spacing="4">
      <Flex alignItems="center" h="6">
        <SkeletonText noOfLines={1} isLoaded={isLoaded} skeletonHeight="18px">
          <Text fontWeight={600} color="gray.500">
            {heading}
          </Text>
        </SkeletonText>
      </Flex>
      <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} gap="4">
        {isLoaded
          ? children
          : Array.from({ length: numSkeletons }).map((_, i) => (
              <Skeleton rounded="md" key={i}>
                <StudySetCard
                  studySet={{
                    id: "",
                    title: "Title",
                    visibility: "Public",
                  }}
                  numTerms={0}
                  user={{
                    username: "username",
                    image: "",
                  }}
                />
              </Skeleton>
            ))}
      </SimpleGrid>
    </Stack>
  );
};
