import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";

import { env } from "@quenti/env/client";
import { api } from "@quenti/trpc";

import {
  Avatar,
  Button,
  ButtonGroup,
  HStack,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";

import { IconUpload } from "@tabler/icons-react";

import { ToastWrapper } from "../../common/toast-wrapper";
import { ChangeUsernameInput } from "../../components/change-username-input";
import { mutationEventChannel } from "../../events/mutation";
import { getSafeRedirectUrl } from "../../lib/urls";
import { UploadAvatarModal } from "../settings/upload-avatar-modal";
import { DefaultLayout } from "./default-layout";
import { PresentWrapper } from "./present-wrapper";

export const OnboardingUsername = () => {
  const router = useRouter();
  const { data: session, update } = useSession()!;
  const utils = api.useUtils();
  const { returnUrl, callbackUrl } = router.query;
  const callback = returnUrl ? getSafeRedirectUrl(returnUrl as string) : null;

  const [image, setImage] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!session?.user?.image) return;
    setImage(session.user.image);
  }, [session?.user?.image]);

  const removeAvatar = api.user.removeAvatar.useMutation({
    onSuccess: ({ image }) => {
      setImage(image);
      void update();
    },
  });

  const [disabled, setDisabled] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [changeAvatarOpen, setChangeAvatarOpen] = React.useState(false);

  return (
    <ToastWrapper>
      <PresentWrapper>
        <DefaultLayout
          heading="Choose a username"
          seoTitle="Choose a Username"
          description="You can change your username and avatar any time in settings."
          defaultNext={!callback}
          onNext={async () => {
            mutationEventChannel.emit("submitUsername");

            if (callback)
              await router.replace({
                pathname: callback,
                query: {
                  callbackUrl,
                },
              });
          }}
          nextDisabled={disabled}
          nextLoading={loading}
        >
          <UploadAvatarModal
            isOpen={changeAvatarOpen}
            onClose={() => setChangeAvatarOpen(false)}
          />
          <VStack w={{ base: "full", md: "sm" }} p="0" m="0" pb="6">
            <ChangeUsernameInput
              showButton={false}
              onChange={async () => {
                await utils.user.me.invalidate();
              }}
              disabledIfUnchanged={false}
              onActionStateChange={(disabled) => setDisabled(disabled)}
              onLoadingChange={(loading) => setLoading(loading)}
            />
            <HStack spacing="6" w="full" mt="3">
              <Avatar
                src={image || ""}
                bg="gray.200"
                _dark={{
                  bg: "gray.700",
                }}
                icon={<></>}
                width="60px"
                height="60px"
                className="highlight-block"
                style={{
                  borderRadius: "50%",
                }}
              />
              <Stack spacing="10px">
                <Text
                  fontSize="sm"
                  color="gray.600"
                  _dark={{
                    color: "gray.400",
                  }}
                >
                  Recommended size 256x256
                </Text>
                <ButtonGroup
                  colorScheme="gray"
                  variant="outline"
                  size="sm"
                  spacing="10px"
                >
                  <Button
                    onClick={() => setChangeAvatarOpen(true)}
                    w="max"
                    leftIcon={<IconUpload size={16} />}
                  >
                    Change avatar
                  </Button>
                  {image && !image?.startsWith(env.NEXT_PUBLIC_APP_URL) && (
                    <Button
                      color="gray.600"
                      _dark={{
                        color: "gray.400",
                      }}
                      isLoading={removeAvatar.isLoading}
                      onClick={() => removeAvatar.mutate()}
                    >
                      Remove
                    </Button>
                  )}
                </ButtonGroup>
              </Stack>
            </HStack>
          </VStack>
        </DefaultLayout>
      </PresentWrapper>
    </ToastWrapper>
  );
};
