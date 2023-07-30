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
import { useRouter } from "next/router";
import React from "react";
import { api } from "../../utils/api";
import { DefaultLayout } from "./default-layout";
import { PresentWrapper, useNextStep } from "./present-wrapper";

export const OnboardingAccountType = () => {
  return (
    <PresentWrapper>
      <AccountType />
    </PresentWrapper>
  );
};

const AccountType = () => {
  const router = useRouter();
  const next = useNextStep();

  const borderColor = useColorModeValue("gray.100", "gray.750");
  const hoverColor = useColorModeValue("gray.50", "gray.800");
  const textHighlight = useColorModeValue("blue.600", "blue.300");

  const hasOrgInvites = router.query.orgInvites === "true";

  const setUserType = api.user.setUserType.useMutation({
    onSuccess: () => {
      const event = new Event("visibilitychange");
      document.dispatchEvent(event);
      next();
    },
  });

  const [type, setType] = React.useState<UserType>(
    hasOrgInvites ? "Teacher" : "Student"
  );

  return (
    <DefaultLayout
      heading="Are you a student or a teacher?"
      description="You can change this later in settings."
      defaultNext={false}
      nextLoading={setUserType.isLoading}
      onNext={async () => {
        await setUserType.mutateAsync({
          type,
        });
      }}
    >
      <Tabs variant="unstyled" shadow="sm" rounded="md" isManual>
        <TabList
          border="2px solid"
          borderColor={borderColor}
          rounded="md"
          overflow="hidden"
        >
          <Tab
            w={{ base: "36", md: "48" }}
            h={{ base: "24", md: "32" }}
            background={type == "Student" ? borderColor : undefined}
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
            w={{ base: "36", md: "48" }}
            h={{ base: "24", md: "32" }}
            background={type == "Teacher" ? borderColor : undefined}
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
    </DefaultLayout>
  );
};
