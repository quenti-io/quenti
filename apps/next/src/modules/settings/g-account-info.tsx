import { useSession } from "next-auth/react";

import { Stack, Text, useColorModeValue } from "@chakra-ui/react";

import { SectionWrapper } from "./section-wrapper";

export const GAccountInfo = () => {
  const session = useSession()!.data!;

  const grayText = useColorModeValue("gray.600", "gray.400");

  if (!session.user) return null;

  return (
    <SectionWrapper
      heading="Google account"
      description="Read-only information about your Google account"
    >
      <Stack spacing={0}>
        <Text fontSize="xl" className="highlight-block" fontWeight={600}>
          {session.user.name}
        </Text>
        <Text fontSize="sm" className="highlight-block" color={grayText}>
          {session.user.email}
        </Text>
      </Stack>
    </SectionWrapper>
  );
};
