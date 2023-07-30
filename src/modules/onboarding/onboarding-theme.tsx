import {
  Tab,
  TabList,
  Tabs,
  Text,
  VStack,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { DefaultLayout } from "./default-layout";
import { PresentWrapper } from "./present-wrapper";
import { ThemePreview } from "./theme-preview";

export const OnboardingTheme = () => {
  const { colorMode, setColorMode } = useColorMode();

  const borderColor = useColorModeValue("gray.200", "gray.750");
  const hoverColor = useColorModeValue("gray.100", "gray.800");

  return (
    <PresentWrapper>
      <DefaultLayout
        heading="Choose your theme"
        description="You can change this later in settings."
      >
        <Tabs variant="unstyled" shadow="sm" rounded="md">
          <TabList
            border="2px solid"
            borderColor={borderColor}
            rounded="md"
            overflow="hidden"
            flexDir={{ base: "column", md: "row" }}
          >
            <Tab
              w="72"
              h="48"
              background={colorMode == "light" ? borderColor : undefined}
              onClick={(e) => {
                e.preventDefault();
                setColorMode("light");
              }}
              _hover={
                colorMode !== "light"
                  ? {
                      background: hoverColor,
                    }
                  : {}
              }
            >
              <VStack spacing="3">
                <ThemePreview variant="light" selected={colorMode == "light"} />
                <Text fontWeight={600}>Light</Text>
              </VStack>
            </Tab>
            <Tab
              w="72"
              h="48"
              background={colorMode == "dark" ? borderColor : undefined}
              onClick={(e) => {
                e.preventDefault();
                setColorMode("dark");
              }}
              _hover={
                colorMode !== "dark"
                  ? {
                      background: hoverColor,
                    }
                  : {}
              }
            >
              <VStack spacing="3">
                <ThemePreview variant="dark" selected={colorMode == "dark"} />
                <Text fontWeight={600}>Dark</Text>
              </VStack>
            </Tab>
          </TabList>
        </Tabs>
      </DefaultLayout>
    </PresentWrapper>
  );
};
