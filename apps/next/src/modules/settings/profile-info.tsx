import { useSession } from "next-auth/react";
import React from "react";

import { Link } from "@quenti/components";
import { api } from "@quenti/trpc";

import {
  Button,
  Divider,
  HStack,
  Skeleton,
  Stack,
  Switch,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

import { IconUser } from "@tabler/icons-react";

import { ChangeUsernameInput } from "../../components/change-username-input";
import { SectionWrapper } from "./section-wrapper";
import { UploadAvatarModal } from "./upload-avatar-modal";

export const ProfileInfo = () => {
  const { data: session, update } = useSession()!;
  const grayText = useColorModeValue("gray.600", "gray.400");
  const divider = useColorModeValue("gray.400", "gray.600");

  const [checked, setChecked] = React.useState(!!session!.user?.displayName);
  const [changeAvatarOpen, setChangeAvatarOpen] = React.useState(false);

  const setDisplayName = api.user.setDisplayName.useMutation();

  return (
    <SectionWrapper
      heading="Profile"
      description="Your username and public profile info"
      additional={
        <Button
          variant="outline"
          leftIcon={<IconUser size={18} />}
          as={Link}
          href={`/@${session!.user!.username}`}
          w="max"
        >
          View your profile
        </Button>
      }
    >
      <UploadAvatarModal
        isOpen={changeAvatarOpen}
        onClose={() => setChangeAvatarOpen(false)}
      />
      <Stack spacing={8}>
        <HStack spacing="4">
          <Skeleton rounded="full" isLoaded={!!session!.user} minW="54px">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={session!.user?.image || ""}
              alt="Avatar"
              width={54}
              height={54}
              className="highlight-block"
              style={{
                borderRadius: "50%",
              }}
            />
          </Skeleton>
          <Stack>
            <Text fontSize="sm" color={grayText}>
              We recommend using an image of at least 512x512 for your avatar
            </Text>
            <Button
              colorScheme="gray"
              variant="outline"
              size="sm"
              onClick={() => setChangeAvatarOpen(true)}
              w="max"
            >
              Change avatar
            </Button>
          </Stack>
        </HStack>
        <Divider borderColor={divider} />
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
            onChange={async () => {
              await update();
            }}
          />
        </Stack>
      </Stack>
    </SectionWrapper>
  );
};
