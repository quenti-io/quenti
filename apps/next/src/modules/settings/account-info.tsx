import { useSession } from "next-auth/react";

import { Heading, Stack, Text, useColorModeValue } from "@chakra-ui/react";

import { SectionWrapper } from "./section-wrapper";

export const AccountInfo = () => {
  const session = useSession()!.data!;

  const grayText = useColorModeValue("gray.600", "gray.400");

  if (!session.user) return null;

  return (
    <SectionWrapper
      heading={session.user.name ? "Google account" : "Account"}
      description="Read-only information about your account"
    >
      <Stack spacing={0}>
        {session.user.name ? (
          <Text fontSize="xl" className="highlight-block" fontWeight={600}>
            {session.user.name}
          </Text>
        ) : (
          <Heading fontSize="md" mb="1">
            Email
          </Heading>
        )}
        <Text fontSize="sm" className="highlight-block" color={grayText}>
          {session.user.email}
        </Text>
      </Stack>
    </SectionWrapper>
  );
};
