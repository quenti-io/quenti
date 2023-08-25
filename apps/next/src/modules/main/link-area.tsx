import { useSession } from "next-auth/react";
import React from "react";

import { Link } from "@quenti/components";

import {
  Box,
  HStack,
  Heading,
  LinkBox,
  LinkOverlay,
  SimpleGrid,
  Skeleton,
  useColorModeValue,
} from "@chakra-ui/react";

import {
  IconBrain,
  IconCards,
  IconGridDots,
  IconLayersSubtract,
  IconMeteor,
  IconReport,
} from "@tabler/icons-react";

import { menuEventChannel } from "../../events/menu";
import { useSet } from "../../hooks/use-set";

export const LinkArea = () => {
  const { id } = useSet();

  return (
    <SimpleGrid
      spacing="4"
      w={{ base: "full", lg: "160px" }}
      h="max-content"
      columns={{ base: 2, md: 3, lg: 1 }}
    >
      <Linkable
        name="Learn"
        icon={<IconBrain />}
        href={`/${id}/learn`}
        requireAuth
      />
      <Linkable
        name="Flashcards"
        icon={<IconCards />}
        href={`/${id}/flashcards`}
      />
      <Linkable
        name="Test"
        icon={<IconReport />}
        href={`/${id}/test`}
        requireAuth
      />
      <Linkable
        name="Match"
        icon={<IconLayersSubtract />}
        href={`/${id}/match`}
        requireAuth
      />
      <Linkable
        name="Crossword"
        icon={<IconGridDots />}
        href="/#coming-soon"
        requireAuth
      />
      <Linkable
        name="Gravity"
        icon={<IconMeteor />}
        href="/#coming-soon"
        requireAuth
      />
    </SimpleGrid>
  );
};

interface LinkableProps {
  name: string;
  icon: React.ReactNode;
  href: string;
  disabled?: boolean;
  requireAuth?: boolean;
  skeleton?: boolean;
}

export const Linkable: React.FC<LinkableProps> = ({
  name,
  icon,
  href,
  disabled = false,
  requireAuth = false,
  skeleton,
}) => {
  const authed = useSession().status == "authenticated";
  const authEnabled = requireAuth && !authed;

  const bg = useColorModeValue("white", "gray.750");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const focusColor = useColorModeValue("gray.50", "gray.700");

  const disabledHeading = useColorModeValue("gray.600", "gray.400");
  const disabledHover = useColorModeValue("gray.200", "gray.600");

  const overlay = !authEnabled ? (
    <LinkOverlay as={Link} href={href} _focusVisible={{ outline: "none" }}>
      {name}
    </LinkOverlay>
  ) : (
    name
  );

  const Wrapper = skeleton ? Skeleton : React.Fragment;

  return (
    <Wrapper rounded="xl">
      <LinkBox
        bg={bg}
        py="4"
        px="5"
        borderBottomWidth="3px"
        rounded="xl"
        borderColor={borderColor}
        shadow="md"
        transition="all ease-in-out 150ms"
        role="group"
        outline="2px solid"
        outlineColor="transparent"
        _hover={{
          transform: "translateY(-2px)",
          borderBottomColor: !disabled ? "blue.200" : disabledHover,
          shadow: "lg",
        }}
        sx={{
          // https://larsmagnus.co/blog/focus-visible-within-the-missing-pseudo-class
          "&:has(:focus-visible)": {
            outlineColor: "blue.300",
            bg: focusColor,
          },
        }}
        cursor="pointer"
        onClick={() => {
          if (authEnabled)
            menuEventChannel.emit("openSignup", {
              message: `Create an account for free to study with ${name}`,
              callbackUrl: href,
            });
        }}
      >
        <HStack spacing="3">
          <Box w="6" h="6" position="relative">
            <Box
              color="blue.400"
              position="absolute"
              filter="blur(2px)"
              top="1"
              left="-1"
              opacity="0.3"
              transition="all ease-in-out 300ms"
              _groupHover={{
                transform: "translateX(-3px)",
              }}
              _groupFocusWithin={{
                transform: "translateX(-3px)",
              }}
            >
              {icon}
            </Box>
            <Box
              color="blue.300"
              position="relative"
              transition="all ease-in-out 300ms"
              _groupHover={{
                transform: "translateY(-2px)",
              }}
              _groupFocusWithin={{
                transform: "translateY(-2px)",
              }}
            >
              {icon}
            </Box>
          </Box>
          <Heading size="sm" color={disabled ? disabledHeading : undefined}>
            {overlay}
          </Heading>
        </HStack>
      </LinkBox>
    </Wrapper>
  );
};
