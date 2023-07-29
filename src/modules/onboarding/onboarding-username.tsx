import { VStack } from "@chakra-ui/react";
import React from "react";
import { ChangeUsernameInput } from "../../components/change-username-input";
import { DefaultLayout } from "./default-layout";
import { PresentWrapper } from "./present-wrapper";

export const OnboardingUsername = () => {
  const [disabled, setDisabled] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const inputRef = React.useRef<{ mutate: () => void }>(null);

  return (
    <PresentWrapper>
      <DefaultLayout
        heading="Choose a username to get started"
        description="You can change your username any time in settings."
        onNext={() => inputRef.current?.mutate()}
        nextDisabled={disabled}
        nextLoading={loading}
      >
        <VStack w="sm" p="0" m="0">
          <ChangeUsernameInput
            ref={inputRef}
            showButton={false}
            disabledIfUnchanged={false}
            onChange={() => {
              const event = new Event("visibilitychange");
              document.dispatchEvent(event);
            }}
            onActionStateChange={(disabled) => setDisabled(disabled)}
            onLoadingChange={(loading) => setLoading(loading)}
          />
        </VStack>
      </DefaultLayout>
    </PresentWrapper>
  );
};
