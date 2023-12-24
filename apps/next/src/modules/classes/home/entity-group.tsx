import {
  Box,
  Button,
  Flex,
  GridItem,
  HStack,
  Heading,
  SimpleGrid,
  SkeletonText,
  Stack,
  Text,
} from "@chakra-ui/react";

import { IconBooks, IconFolderPlus, IconFolders } from "@tabler/icons-react";

import { GenericCard } from "../../../components/generic-card";
import { ClassTeacherOnly } from "../class-teacher-only";

export interface EntityGroupProps {
  heading: string;
  isLoaded?: boolean;
  numSkeletons?: number;
  onRequestAdd: () => void;
  type: "folder" | "studySet";
}

export const EntityGroup: React.FC<
  EntityGroupProps & { children?: React.ReactNode[] }
> = ({
  heading,
  isLoaded = true,
  numSkeletons = 3,
  onRequestAdd,
  type,
  children,
}) => {
  const Icon = type == "folder" ? IconFolders : IconBooks;

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
      <ClassTeacherOnly>
        {isLoaded && !children?.length && (
          <Box
            w="full"
            rounded="lg"
            px="8"
            py="6"
            borderWidth="2px"
            borderColor="gray.200"
            _dark={{ borderColor: "gray.750" }}
            color="gray.500"
          >
            <HStack spacing="4" flexDir={{ base: "column", sm: "row" }}>
              <Box
                transform="rotate(-10deg)"
                w="max-content"
                color="gray.400"
                _dark={{
                  color: "gray.600",
                }}
              >
                <Icon size={48} strokeWidth="1.5px" />
              </Box>
              <Stack spacing="0">
                <Heading fontSize="lg" color="gray.500" fontWeight={600}>
                  Add {type == "folder" ? "folders" : "study sets"} to your
                  class
                </Heading>
                <Text fontSize="sm" color="gray.500">
                  {type == "folder" ? "Folders" : "Study sets"} will be publicly
                  displayed for students to see on your homepage.
                </Text>
              </Stack>
            </HStack>
          </Box>
        )}
      </ClassTeacherOnly>
      <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} gap="4">
        {isLoaded
          ? children
          : Array.from({ length: numSkeletons }).map((_, i) => (
              <GridItem h="141px" key={i}>
                <GenericCard.Skeleton />
              </GridItem>
            ))}
      </SimpleGrid>
    </Stack>
  );
};
