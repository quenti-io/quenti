import {
  Button,
  Flex,
  HStack,
  SimpleGrid,
  Skeleton,
  SkeletonText,
  Stack,
  Text,
} from "@chakra-ui/react";
import { IconFolderPlus } from "@tabler/icons-react";
import { StudySetCard } from "../../components/study-set-card";
import { ClassTeacherOnly } from "./class-teacher-only";

export interface EntityGroupProps {
  heading: string;
  isLoaded?: boolean;
  numSkeletons?: number;
  onRequestAdd: () => void;
}

export const EntityGroup: React.FC<
  React.PropsWithChildren<EntityGroupProps>
> = ({
  heading,
  isLoaded = true,
  numSkeletons = 3,
  onRequestAdd,
  children,
}) => {
  return (
    <Stack spacing="4">
      <Flex alignItems="center" h="6">
        <SkeletonText noOfLines={1} isLoaded={isLoaded} skeletonHeight="18px">
          <HStack spacing="3">
            <Text fontWeight={600} color="gray.500">
              {heading}
            </Text>
            <ClassTeacherOnly>
              <Button
                size="xs"
                rounded="full"
                leftIcon={<IconFolderPlus size={16} />}
                onClick={onRequestAdd}
                variant="ghost"
                gap="0"
              >
                Add
              </Button>
            </ClassTeacherOnly>
          </HStack>
        </SkeletonText>
      </Flex>
      <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} gap="4">
        {isLoaded
          ? children
          : Array.from({ length: numSkeletons }).map((_, i) => (
              <Skeleton rounded="lg" key={i}>
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
