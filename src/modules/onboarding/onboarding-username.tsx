import { VStack } from "@chakra-ui/react";
import { ChangeUsernameInput } from "../../components/change-username-input";
import { DefaultLayout } from "./default-layout";
import { PresentWrapper } from "./present-wrapper";
import React from "react";
import { useRouter } from "next/router";

export const OnboardingUsername = () => {
  const router = useRouter();
  const [disabled, setDisabled] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const inputRef = React.useRef<{ mutate: () => void }>(null);

  return (
    <PresentWrapper step={2}>
      <DefaultLayout
        heading="Choose a username to get started"
        description="You can change your username any time in settings."
        onNext={async () => {
          inputRef.current?.mutate();
          await router.push("/onboarding/account-type");
        }}
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
