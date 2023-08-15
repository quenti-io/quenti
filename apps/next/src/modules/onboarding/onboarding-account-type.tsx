import { useRouter } from "next/router";
import React from "react";

import type { UserType } from "@quenti/prisma/client";
import { api } from "@quenti/trpc";

import { HStack, Text, useColorModeValue } from "@chakra-ui/react";

import { IconBooks, IconSchool } from "@tabler/icons-react";

import { ToggleGroup } from "../../components/toggle-group";
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

  const textHighlight = useColorModeValue("blue.500", "blue.300");

  const hasOrgInvites = router.query.orgInvites === "true";

  const setUserType = api.user.setUserType.useMutation({
    onSuccess: () => {
      const event = new Event("visibilitychange");
      document.dispatchEvent(event);
      next();
    },
  });

  const [type, setType] = React.useState<UserType>(
    hasOrgInvites ? "Teacher" : "Student",
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
      <ToggleGroup
        index={type == "Student" ? 0 : 1}
        onChange={(index) => setType(index == 0 ? "Student" : "Teacher")}
        tabProps={{
          w: { base: "36", md: "48" },
          h: { base: "24", md: "32" },
        }}
      >
        <ToggleGroup.Tab>
          <HStack
            color={type == "Student" ? textHighlight : undefined}
            transition="color 0.15s ease-in-out"
          >
            <IconBooks size={18} />
            <Text fontWeight={600}>Student</Text>
          </HStack>
        </ToggleGroup.Tab>
        <ToggleGroup.Tab>
          <HStack
            color={type == "Teacher" ? textHighlight : undefined}
            transition="color 0.15s ease-in-out"
          >
            <IconSchool size={18} />
            <Text fontWeight={600}>Teacher</Text>
          </HStack>
        </ToggleGroup.Tab>
      </ToggleGroup>
    </DefaultLayout>
  );
};
