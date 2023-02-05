import {
  Avatar,
  Box,
  Flex,
  Heading,
  HStack,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import type { StudySet } from "@prisma/client";
import React from "react";
import { visibilityIcon } from "../../common/visibility-icon";
import { avatarUrl } from "../../utils/avatar";
import { plural } from "../../utils/string";

export interface SelectableStudySetProps {
  studySet: Pick<StudySet, "id" | "title" | "visibility">;
  numTerms: number;
  user: {
    username: string;
    image: string | null;
  };
  selected: boolean;
  onSelect: () => void;
}

export const SelectableStudySet: React.FC<SelectableStudySetProps> = ({
  studySet,
  numTerms,
  user,
  selected,
  onSelect,
}) => {
  const termsTextColor = useColorModeValue("gray.600", "gray.400");
  const linkBg = useColorModeValue("white", "gray.800");
  const linkBorder = useColorModeValue("gray.200", "gray.700");

  return (
    <Box
      as="article"
      h="full"
      rounded="md"
      p="5"
      bg={linkBg}
      borderColor={selected ? "green.300" : linkBorder}
      borderWidth="2px"
      shadow="lg"
      transition="all ease-in-out 150ms"
      _hover={{
        transform: "translateY(-2px)",
      }}
      cursor="pointer"
      onClick={onSelect}
    >
      <Flex justifyContent="space-between" flexDir="column" h="full" gap={4}>
        <Stack spacing={2}>
          <Heading size="md">{studySet.title}</Heading>
          <HStack gap={0} color={termsTextColor}>
            <Text fontSize="sm">{plural(numTerms, "term")}</Text>
            {studySet.visibility !== "Public" &&
              visibilityIcon(studySet.visibility, 16)}
          </HStack>
        </Stack>
        <HStack gap="2px">
          <Avatar src={avatarUrl(user)} size="xs" />
          <Text fontSize="sm" fontWeight={600}>
            {user.username}
          </Text>
        </HStack>
      </Flex>
    </Box>
  );
};
