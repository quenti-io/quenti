import React from "react";

import { outfit } from "@quenti/lib/chakra-theme";

import {
  Card,
  Heading,
  Kbd,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";

import { menuEventChannel } from "../../events/menu";
import { MOD } from "../../lib/tinykeys";
import { DefaultLayout } from "./default-layout";
import { PresentWrapper } from "./present-wrapper";

export const OnboardingCommandMenu = () => {
  const [interacted, setInteracted] = React.useState(false);

  React.useEffect(() => {
    menuEventChannel.on("commandMenuClosed", () => {
      setInteracted(true);
    });
  }, []);

  const cardBorder = useColorModeValue("gray.200", "gray.700");
  const mutedColor = useColorModeValue("gray.800", "gray.200");
  const keyBg = useColorModeValue("gray.200", "gray.700");
  const keyBgHover = useColorModeValue("gray.300", "gray.600");
  const keyBorder = useColorModeValue("gray.300", "gray.600");
  const keyBorderHover = useColorModeValue("gray.400", "gray.500");

  return (
    <PresentWrapper>
      <DefaultLayout
        heading={interacted ? "That wasn't too bad!" : "Command menu"}
        seoTitle="Command Menu"
        description={
          interacted ? (
            <>
              Don&apos;t forget, you can always{" "}
              <b>{MOD == "Control" ? "Ctrl" : "⌘"} + K</b> to navigate Quenti.
            </>
          ) : (
            "Navigate between sets, folders and classes quickly."
          )
        }
        nextVariant={interacted ? "solid" : "outline"}
        nextDisabled={!interacted}
      >
        {!interacted && (
          <Card
            variant="outline"
            p="10"
            pb="12"
            w="lg"
            bg="transparent"
            borderColor={cardBorder}
          >
            <VStack spacing="4">
              <Text fontSize="sm" color="gray.500">
                Try opening the command menu with:
              </Text>
              <Heading size="3xl" color={mutedColor} userSelect="none">
                <Kbd
                  fontFamily={outfit.style.fontFamily}
                  px="4"
                  py="1"
                  shadow="lg"
                  rounded="lg"
                  background={keyBg}
                  borderWidth="0"
                  borderBottomWidth="3px"
                  borderColor={keyBorder}
                  transition="all 0.15s ease-in-out"
                  _hover={{
                    background: keyBgHover,
                    borderColor: keyBorderHover,
                  }}
                >
                  {MOD == "Control" ? "Ctrl" : "⌘"}
                </Kbd>{" "}
                <Kbd
                  fontFamily={outfit.style.fontFamily}
                  px="5"
                  py="1"
                  shadow="lg"
                  rounded="lg"
                  background={keyBg}
                  borderWidth="0"
                  borderBottomWidth="3px"
                  borderColor={keyBorder}
                  transition="all 0.15s ease-in-out"
                  _hover={{
                    background: keyBgHover,
                    borderColor: keyBorderHover,
                  }}
                >
                  K
                </Kbd>
              </Heading>
            </VStack>
          </Card>
        )}
      </DefaultLayout>
    </PresentWrapper>
  );
};
