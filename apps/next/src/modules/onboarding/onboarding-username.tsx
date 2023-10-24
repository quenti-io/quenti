import React from "react";

import { VStack } from "@chakra-ui/react";

import { ChangeUsernameInput } from "../../components/change-username-input";
import { mutationEventChannel } from "../../events/mutation";
import { DefaultLayout } from "./default-layout";
import { PresentWrapper } from "./present-wrapper";

export const OnboardingUsername = () => {
  const [disabled, setDisabled] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  return (
    <PresentWrapper>
      <DefaultLayout
        heading="Choose a username"
        seoTitle="Choose a Username"
        description="You can change your username any time in settings."
        onNext={() => mutationEventChannel.emit("submitUsername")}
        nextDisabled={disabled}
        nextLoading={loading}
      >
        <VStack w={{ base: "full", md: "sm" }} p="0" m="0">
          <ChangeUsernameInput
            showButton={false}
            disabledIfUnchanged={false}
            onActionStateChange={(disabled) => setDisabled(disabled)}
            onLoadingChange={(loading) => setLoading(loading)}
          />
        </VStack>
      </DefaultLayout>
    </PresentWrapper>
  );
};
