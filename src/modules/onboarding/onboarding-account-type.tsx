import {
  HStack,
  Tab,
  TabList,
  Tabs,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { IconBooks, IconSchool } from "@tabler/icons-react";
import React from "react";
import { DefaultLayout } from "./default-layout";
import { PresentWrapper } from "./present-wrapper";

export const OnboardingAccountType = () => {
  const borderColor = useColorModeValue("gray.100", "gray.750");
  const hoverColor = useColorModeValue("gray.50", "gray.800");
  const textHighlight = useColorModeValue("blue.600", "blue.300");

  const [index, setIndex] = React.useState(0);

  return (
    <PresentWrapper>
      <DefaultLayout
        heading="Are you a student or a teacher?"
        description="You can change this later in settings."
      >
        <Tabs
          variant="unstyled"
          shadow="sm"
          rounded="md"
          tabIndex={index}
          onChange={(i) => setIndex(i)}
        >
          <TabList border="2px solid" borderColor={borderColor} rounded="md">
            <Tab
              w="48"
              h="32"
              _selected={{
                background: borderColor,
              }}
              _hover={
                index !== 0
                  ? {
                      background: hoverColor,
                    }
                  : {}
              }
            >
              <HStack
                color={index == 0 ? textHighlight : undefined}
                transition="color 0.15s ease-in-out"
              >
                <IconBooks size={18} />
                <Text fontWeight={600}>Student</Text>
              </HStack>
            </Tab>
            <Tab
              w="48"
              h="32"
              _selected={{
                background: borderColor,
              }}
              _hover={
                index !== 1
                  ? {
                      background: hoverColor,
                    }
                  : {}
              }
            >
              <HStack
                color={index == 1 ? textHighlight : undefined}
                transition="color 0.15s ease-in-out"
              >
                <IconSchool size={18} />
                <Text fontWeight={600}>Teacher</Text>
              </HStack>
            </Tab>
          </TabList>
        </Tabs>
      </DefaultLayout>
    </PresentWrapper>
  );
};
