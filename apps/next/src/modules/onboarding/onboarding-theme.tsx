import { ToggleGroup } from "@quenti/components/toggle-group";

import {
  Text,
  VStack,
  useBreakpointValue,
  useColorMode,
} from "@chakra-ui/react";

import { DefaultLayout } from "./default-layout";
import { PresentWrapper } from "./present-wrapper";
import { ThemePreview } from "./theme-preview";

export const OnboardingTheme = () => {
  const { colorMode, setColorMode } = useColorMode();

  const orientation: "vertical" | "horizontal" | undefined = useBreakpointValue(
    {
      base: "vertical",
      md: "horizontal",
    },
  );

  return (
    <PresentWrapper>
      <DefaultLayout
        heading="Choose your theme"
        seoTitle="Choose Your Theme"
        description="You can change this later in settings."
      >
        <ToggleGroup
          index={colorMode == "light" ? 0 : 1}
          orientation={orientation}
          tabProps={{
            w: 72,
            h: 48,
          }}
        >
          <ToggleGroup.Tab
            onClick={(e) => {
              e.preventDefault();
              setColorMode("light");
            }}
          >
            <VStack spacing="3">
              <ThemePreview variant="light" selected={colorMode == "light"} />
              <Text fontWeight={600}>Light</Text>
            </VStack>
          </ToggleGroup.Tab>
          <ToggleGroup.Tab
            onClick={(e) => {
              e.preventDefault();
              setColorMode("dark");
            }}
          >
            <VStack spacing="3">
              <ThemePreview variant="dark" selected={colorMode == "dark"} />
              <Text fontWeight={600}>Dark</Text>
            </VStack>
          </ToggleGroup.Tab>
        </ToggleGroup>
      </DefaultLayout>
    </PresentWrapper>
  );
};
