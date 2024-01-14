import { useSession } from "next-auth/react";
import React from "react";

import { ToggleGroup } from "@quenti/components/toggle-group";
import type { UserType } from "@quenti/prisma/client";
import { api } from "@quenti/trpc";

import { HStack, Text, useColorModeValue } from "@chakra-ui/react";

import { IconBooks, IconSchool } from "@tabler/icons-react";

import { SectionWrapper } from "./section-wrapper";

export const AccountType = () => {
  const { data: session, update } = useSession();

  const setUserType = api.user.setUserType.useMutation({
    onSuccess: async () => {
      await update();
    },
  });

  const [type, setType] = React.useState<UserType>(session!.user!.type);

  const textHighlight = useColorModeValue("blue.500", "blue.300");

  return (
    <SectionWrapper
      heading="Account type"
      description="Select your account type"
    >
      <ToggleGroup
        index={type == "Student" ? 0 : 1}
        tabProps={{ w: "full" }}
        h="max-content"
      >
        <ToggleGroup.Tab
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
        </ToggleGroup.Tab>
        <ToggleGroup.Tab
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
        </ToggleGroup.Tab>
      </ToggleGroup>
    </SectionWrapper>
  );
};
