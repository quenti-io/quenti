import React from "react";

import { avatarUrl } from "@quenti/lib/avatar";
import type { StudySetVisibility } from "@quenti/prisma/client";

import {
  Avatar,
  Box,
  Flex,
  HStack,
  Heading,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

import { IconFolder } from "@tabler/icons-react";

import { visibilityIcon } from "../common/visibility-icon";
import { plural } from "../utils/string";

export interface SelectableGenericCard {
  type: "set" | "folder";
  title: string;
  visibility?: StudySetVisibility;
  numItems: number;
  user: {
    username: string;
    image: string | null;
  };
  bottom?: React.ReactNode;
  selected: boolean;
  onSelect: () => void;
}

export const SelectableGenericCard: React.FC<SelectableGenericCard> = ({
  type,
  title,
  visibility,
  numItems,
  user,
  bottom,
  selected,
  onSelect,
}) => {
  const termsTextColor = useColorModeValue("gray.600", "gray.400");
  const linkBg = useColorModeValue("white", "gray.750");
  const linkBorder = useColorModeValue("gray.200", "gray.700");

  const reverseTitle = type == "folder";

  return (
    <Box
      as="button"
      h="full"
      w="full"
      textAlign="start"
      rounded="lg"
      p="5"
      bg={linkBg}
      borderColor={selected ? "green.300" : linkBorder}
      borderWidth="2px"
      shadow="lg"
      transition="all ease-in-out 150ms"
      _hover={{
        transform: "translateY(-2px)",
      }}
      outline="solid 2px transparent"
      outlineOffset={2}
      _focusVisible={{
        outlineColor: "blue.200",
      }}
      cursor="pointer"
      onClick={onSelect}
    >
      <Flex justifyContent="space-between" flexDir="column" h="full" gap={4}>
        <Stack
          spacing={2}
          direction={reverseTitle ? "column-reverse" : "column"}
        >
          <Heading
            size="md"
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              lineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflowWrap: "anywhere",
            }}
          >
            {title}
          </Heading>
          <HStack spacing="2" color={termsTextColor}>
            {type == "folder" && <IconFolder size={16} />}
            <Text fontSize="sm">
              {plural(numItems, type == "folder" ? "set" : "term")}
            </Text>
            {visibility &&
              visibility !== "Public" &&
              visibilityIcon(visibility, 16)}
          </HStack>
        </Stack>
        {!bottom ? (
          <HStack spacing="2">
            <Avatar
              src={avatarUrl(user)}
              size="xs"
              className="highlight-block"
            />
            <Text
              fontSize="sm"
              fontWeight={600}
              className="highlight-block"
              w="max-content"
            >
              {user.username}
            </Text>
          </HStack>
        ) : (
          bottom
        )}
      </Flex>
    </Box>
  );
};
