import { Button, Link, Stack, Text, useColorModeValue } from "@chakra-ui/react";
import { IconUser } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { ChangeUsernameInput } from "../../components/change-username-input";
import { SectionWrapper } from "./section-wrapper";

export const ProfileInfo = () => {
  const session = useSession()!.data!;
  const grayText = useColorModeValue("gray.600", "gray.400");

  return (
    <SectionWrapper
      heading="Profile"
      description="Your public profile settings and username."
    >
      <Stack spacing={8}>
        <Stack spacing={2}>
          <Text color={grayText} fontSize="sm">
            Profile
          </Text>
          <Button
            variant="outline"
            leftIcon={<IconUser size={18} />}
            as={Link}
            href={`/@${session.user!.username}`}
          >
            Go to Profile
          </Button>
        </Stack>
        <Stack spacing={2}>
          <Text color={grayText} fontSize="sm">
            Change Username
          </Text>
          <ChangeUsernameInput
            buttonLabel="Change"
            onChange={() => {
              const event = new Event("visibilitychange");
              document.dispatchEvent(event);
            }}
          />
        </Stack>
      </Stack>
    </SectionWrapper>
  );
};
