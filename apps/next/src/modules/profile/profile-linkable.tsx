import { Link } from "@quenti/components";
import type { StudySetVisibility } from "@quenti/prisma/client";

import {
  Box,
  Flex,
  HStack,
  Heading,
  LinkBox,
  LinkOverlay,
  Skeleton,
  Stack,
  Text,
} from "@chakra-ui/react";

import { visibilityIcon } from "../../common/visibility-icon";
import { plural } from "../../utils/string";

interface ProfileLinkableProps {
  title: string;
  url: string;
  numValues: number;
  label: string;
  visibility?: StudySetVisibility;
  leftIcon?: React.ReactNode;
}

export const ProfileLinkable = ({
  title,
  url,
  numValues,
  label,
  visibility,
  leftIcon,
}: ProfileLinkableProps) => {
  return (
    <LinkBox
      as="article"
      h="full"
      rounded="lg"
      p="4"
      bg="white"
      borderWidth="2px"
      borderColor="gray.200"
      _hover={{
        transform: "translateY(-2px)",
        borderBottomColor: "blue.300",
      }}
      _dark={{
        bg: "gray.800",
        borderColor: "gray.700",
        _hover: {
          borderBottomColor: "blue.300",
        },
      }}
      sx={{
        "&:has(:focus-visible)": {
          borderColor: "blue.300",
          transform: "translateY(-2px)",
          _dark: {
            borderColor: "blue.300",
          },
        },
      }}
      shadow="md"
      transition="all ease-in-out 150ms"
    >
      <Stack spacing={2}>
        <Text
          fontSize="sm"
          color="gray.600"
          _dark={{
            color: "gray.400",
          }}
        >
          {plural(numValues, label)}
        </Text>
        <HStack>
          {leftIcon}
          <Heading
            size="md"
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              lineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            <LinkOverlay as={Link} href={url}>
              {title}
            </LinkOverlay>
          </Heading>
          {visibility && visibility !== "Public" ? (
            <Box color="gray.500">{visibilityIcon(visibility, 18)}</Box>
          ) : (
            ""
          )}
        </HStack>
      </Stack>
    </LinkBox>
  );
};

ProfileLinkable.Skeleton = function ProfileLinkableSkeleton() {
  return (
    <Box
      h="full"
      rounded="lg"
      p="4"
      bg="white"
      borderWidth="2px"
      borderColor="gray.200"
      _dark={{
        bg: "gray.800",
        borderColor: "gray.700",
      }}
      shadow="md"
    >
      <Stack spacing={2}>
        <Flex alignItems="center" h="21px">
          <Skeleton rounded="4px" fitContent h="14px">
            <Text fontSize="sm">10 terms</Text>
          </Skeleton>
        </Flex>
        <Skeleton fitContent rounded="md">
          <Heading size="md">Placeholder Set Title</Heading>
        </Skeleton>
      </Stack>
    </Box>
  );
};
