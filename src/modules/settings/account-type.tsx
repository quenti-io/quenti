import {
  HStack,
  Tab,
  TabList,
  Tabs,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import type { UserType } from "@prisma/client";
import { IconBooks, IconSchool } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import React from "react";
import { api } from "../../utils/api";
import { SectionWrapper } from "./section-wrapper";

export const AccountType = () => {
  const { data: session } = useSession();

  const setUserType = api.user.setUserType.useMutation({
    onSuccess: () => {
      const event = new Event("visibilitychange");
      document.dispatchEvent(event);
    },
  });

  const [type, setType] = React.useState<UserType>(session!.user!.type);

  const borderColor = useColorModeValue("gray.100", "gray.750");
  const hoverColor = useColorModeValue("gray.50", "gray.800");
  const textHighlight = useColorModeValue("blue.600", "blue.300");

  return (
    <SectionWrapper
      heading="Account Type"
      description="Select your account type."
    >
      <Tabs variant="unstyled" shadow="sm" rounded="md" isManual>
        <TabList
          border="2px solid"
          borderColor={borderColor}
          rounded="md"
          overflow="hidden"
        >
          <Tab
            w="full"
            background={type === "Student" ? borderColor : undefined}
            _hover={
              type !== "Student"
                ? {
                    background: hoverColor,
                  }
                : {}
            }
            onClick={(e) => {
              e.preventDefault();
              setType("Student");
              void setUserType.mutateAsync({ type: "Student" });
            }}
          >
            <HStack
              color={type == "Student" ? textHighlight : undefined}
              transition="color 0.15s ease-in-out"
            >
              <IconBooks size={18} />
              <Text fontWeight={600}>Student</Text>
            </HStack>
          </Tab>
          <Tab
            w="full"
            background={type === "Teacher" ? borderColor : undefined}
            _hover={
              type !== "Teacher"
                ? {
                    background: hoverColor,
                  }
                : {}
            }
            onClick={(e) => {
              e.preventDefault();
              setType("Teacher");
              void setUserType.mutateAsync({ type: "Teacher" });
            }}
          >
            <HStack
              color={type == "Teacher" ? textHighlight : undefined}
              transition="color 0.15s ease-in-out"
            >
              <IconSchool size={18} />
              <Text fontWeight={600}>Teacher</Text>
            </HStack>
          </Tab>
        </TabList>
      </Tabs>
    </SectionWrapper>
  );
};
