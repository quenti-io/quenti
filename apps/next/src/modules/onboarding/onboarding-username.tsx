import { useRouter } from "next/router";
import React from "react";

import { api } from "@quenti/trpc";

import { VStack } from "@chakra-ui/react";

import { ChangeUsernameInput } from "../../components/change-username-input";
import { mutationEventChannel } from "../../events/mutation";
import { getSafeRedirectUrl } from "../../lib/urls";
import { DefaultLayout } from "./default-layout";
import { PresentWrapper } from "./present-wrapper";

export const OnboardingUsername = () => {
  const router = useRouter();
  const utils = api.useUtils();
  const { returnUrl, callbackUrl } = router.query;
  const callback = returnUrl ? getSafeRedirectUrl(returnUrl as string) : null;

  const [disabled, setDisabled] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  return (
    <PresentWrapper>
      <DefaultLayout
        heading="Choose a username"
        seoTitle="Choose a Username"
        description="You can change your username any time in settings."
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
        <VStack w={{ base: "full", md: "sm" }} p="0" m="0">
          <ChangeUsernameInput
            showButton={false}
            onChange={async () => {
              await utils.user.me.invalidate();
            }}
            disabledIfUnchanged={false}
            onActionStateChange={(disabled) => setDisabled(disabled)}
            onLoadingChange={(loading) => setLoading(loading)}
          />
        </VStack>
      </DefaultLayout>
    </PresentWrapper>
  );
};
