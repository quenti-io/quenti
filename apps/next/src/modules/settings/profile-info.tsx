import {
  Button,
  HStack,
  Stack,
  Switch,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { IconUser } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import React from "react";
import { ChangeUsernameInput } from "../../components/change-username-input";
import { Link } from "@quenti/components";
import { api } from "@quenti/trpc";
import { SectionWrapper } from "./section-wrapper";

export const ProfileInfo = () => {
  const session = useSession()!.data!;
  const grayText = useColorModeValue("gray.600", "gray.400");

  const [checked, setChecked] = React.useState(!!session.user?.displayName);

  const setDisplayName = api.user.setDisplayName.useMutation();

  return (
    <SectionWrapper
      heading="Profile"
      description="Your public profile settings and username."
      additional={
        <Button
          variant="outline"
          leftIcon={<IconUser size={18} />}
          as={Link}
          href={`/@${session.user!.username}`}
        >
          Go to Profile
        </Button>
      }
    >
      <Stack spacing={8}>
        <HStack spacing={4}>
          <Switch
            size="lg"
            isChecked={checked}
            onChange={(e) => {
              setChecked(e.target.checked);
              setDisplayName.mutate({ displayName: e.target.checked });
            }}
          />
          <Text color={grayText} fontSize="sm">
            Display your real name on your profile
          </Text>
        </HStack>
        <Stack spacing={2}>
          <Text color={grayText} fontSize="sm">
            Change username
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
