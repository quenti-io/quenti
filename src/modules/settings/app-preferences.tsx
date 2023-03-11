import {
  Button,
  ButtonGroup,
  Stack,
  Text,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { IconMoon, IconSun } from "@tabler/icons-react";
import { SectionWrapper } from "./section-wrapper";

export const AppPreferences = () => {
  const { colorMode, setColorMode } = useColorMode();
  const grayText = useColorModeValue("gray.600", "gray.400");

  return (
    <SectionWrapper
      heading="App Preferences"
      description="Change preferences for this device."
    >
      <Stack spacing={2}>
        <Text color={grayText} fontSize="sm">
          Theme
        </Text>
        <ButtonGroup isAttached>
          <Button
            leftIcon={<IconSun size={18} />}
            variant={colorMode == "light" ? "solid" : "outline"}
            onClick={() => setColorMode("light")}
          >
            Light
          </Button>
          <Button
            leftIcon={<IconMoon size={18} />}
            variant={colorMode == "dark" ? "solid" : "outline"}
            onClick={() => setColorMode("dark")}
          >
            Dark
          </Button>
        </ButtonGroup>
      </Stack>
    </SectionWrapper>
  );
};
