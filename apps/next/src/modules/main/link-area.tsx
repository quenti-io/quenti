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
  useColorModeValue,
} from "@chakra-ui/react";

import {
  IconBrain,
  IconCards,
  IconGridDots,
  IconLayersSubtract,
  IconLock,
  IconMeteor,
  IconReport,
} from "@tabler/icons-react";

import { TooltipWithTouch } from "../../components/tooltip-with-touch";
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
        href={`/${id}/match?intro=true`}
        requireAuth
      />
      <Linkable name="Crossword" icon={<IconGridDots />} comingSoon />
      <Linkable name="Gravity" icon={<IconMeteor />} comingSoon />
    </SimpleGrid>
  );
};

interface LinkableProps {
  name: string;
  icon: React.ReactNode;
  href?: string;
  disabled?: boolean;
  requireAuth?: boolean;
  comingSoon?: boolean;
}

export const Linkable: React.FC<LinkableProps> = ({
  name,
  icon,
  href = "",
  disabled = false,
  requireAuth = false,
  comingSoon = false,
}) => {
  const authed = useSession().status == "authenticated";
  const authEnabled = requireAuth && !authed;

  const bg = useColorModeValue("white", "gray.750");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const focusColor = useColorModeValue("gray.50", "gray.700");

  const disabledHeading = useColorModeValue("gray.600", "gray.400");
  const disabledHover = useColorModeValue("gray.200", "gray.600");

  const Wrapper: React.FC<React.PropsWithChildren> = ({ children }) => {
    if (!comingSoon) return <>{children}</>;

    return <TooltipWithTouch label="Coming soon">{children}</TooltipWithTouch>;
  };

  const overlay =
    !authEnabled && !comingSoon ? (
      <LinkOverlay as={Link} href={href} _focusVisible={{ outline: "none" }}>
        {name}
      </LinkOverlay>
    ) : (
      name
    );

  return (
    <Wrapper>
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
        position="relative"
        onClick={() => {
          if (authEnabled)
            menuEventChannel.emit("openSignup", {
              message: `Create an account for free to study with ${name}`,
              callbackUrl: href,
            });
        }}
      >
        {comingSoon && (
          <Box
            p="1"
            rounded="full"
            position="absolute"
            top="-2"
            left="-3"
            color="blue.600"
            bg="gray.50"
            _dark={{
              color: "blue.200",
              bg: "gray.900",
            }}
          >
            <Box
              bg="white"
              _dark={{
                bg: "gray.750",
              }}
              p="4px"
              rounded="full"
              shadow="md"
            >
              <IconLock size={16} />
            </Box>
          </Box>
        )}
        <HStack spacing="3">
          <Box w="6" h="6" position="relative">
            <Box
              color={!comingSoon ? "blue.400" : "gray.400"}
              _dark={{
                color: !comingSoon ? "blue.400" : "gray.600",
              }}
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
              color={!comingSoon ? "blue.300" : "blue.300"}
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
