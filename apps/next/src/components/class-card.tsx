import { Link } from "@quenti/components";
import type { Widen } from "@quenti/lib/widen";
import type { UserType } from "@quenti/prisma/client";

import {
  Box,
  Flex,
  HStack,
  Heading,
  LinkBox,
  LinkOverlay,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

import { IconPointFilled } from "@tabler/icons-react";

import { ClassLogo } from "../modules/classes/class-logo";
import { plural } from "../utils/string";

interface ClassCardProps {
  id: string;
  name: string;
  bannerColor: string;
  logo?: string | null;
  hash?: string | null;
  variant?: "selectable" | "normal";
  data: Widen<
    | { students: number; sections: number }
    | { studySets: number; folders: number }
  >;
  for: UserType;
  disableLink?: boolean;
  selected?: boolean;
  onClick?: () => void;
}

export const ClassCard: React.FC<ClassCardProps> = ({
  id,
  name,
  bannerColor,
  data,
  logo,
  hash,
  for: for_,
  variant = "normal",
  disableLink = false,
  selected = false,
  onClick,
}) => {
  const linkBg = useColorModeValue("white", "gray.800");
  const linkBorder = useColorModeValue("gray.200", "gray.700");

  const children = disableLink ? (
    name
  ) : (
    <LinkOverlay
      as={Link}
      href={`/classes/${id}`}
      _focus={{
        outline: "none",
      }}
    >
      {name}
    </LinkOverlay>
  );

  return (
    <LinkBox
      as="article"
      h="full"
      rounded="lg"
      p="5"
      bg={linkBg}
      borderColor={selected ? "blue.300" : linkBorder}
      opacity={variant !== "selectable" || selected ? 1 : 0.7}
      borderWidth="2px"
      shadow="lg"
      position="relative"
      transition="all ease-in-out 150ms"
      cursor={variant == "selectable" ? "pointer" : undefined}
      _hover={{
        transform: "translateY(-2px)",
        ...(variant == "normal" ? { borderBottomColor: "blue.300" } : {}),
      }}
      sx={{
        "&:has(:focus-visible)": {
          transform: "translateY(-2px)",
          ...(variant == "normal" ? { borderColor: "blue.300" } : {}),
        },
      }}
      overflow="hidden"
      onClick={onClick}
    >
      <Box
        w="full"
        h="12"
        position="absolute"
        p="2"
        display="flex"
        justifyContent="end"
        top="0"
        left="0"
        bgGradient={`linear(to-r, blue.400, ${bannerColor})`}
        zIndex="50"
        pointerEvents="none"
      />
      <Stack mt="-1" spacing="4">
        <Flex
          alignItems="end"
          pointerEvents="none"
          justifyContent="space-between"
        >
          <Box
            w="16"
            h="16"
            bg={linkBg}
            zIndex="100"
            position="relative"
            rounded="18px"
            p="6px"
          >
            <Box w="52px" h="52px" rounded="xl" shadow="lg" overflow="hidden">
              <ClassLogo width={52} height={52} url={logo} hash={hash} />
            </Box>
          </Box>
        </Flex>
        <Stack ml="1" spacing="1">
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
            {children}
          </Heading>
          <HStack fontSize="sm" color="gray.500" spacing="1">
            {for_ == "Student" ? (
              <Text>{plural(data.studySets || 0, "set")}</Text>
            ) : (
              <Text>{plural(data.students || 0, "student")}</Text>
            )}
            <IconPointFilled size={10} />
            {for_ == "Student" ? (
              <Text>{plural(data.folders || 0, "folder")}</Text>
            ) : (
              <Text>{plural(data.sections || 0, "section")}</Text>
            )}
          </HStack>
        </Stack>
      </Stack>
    </LinkBox>
  );
};
