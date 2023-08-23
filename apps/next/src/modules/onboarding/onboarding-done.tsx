import React from "react";

import { api } from "@quenti/trpc";

import { DefaultLayout } from "./default-layout";
import { PresentWrapper, useNextStep } from "./present-wrapper";

export const OnboardingDone = () => {
  const next = useNextStep();

  const [startedLoading, setStartedLoading] = React.useState(false);

  const completeOnboarding = api.user.completeOnboarding.useMutation({
    onSuccess: async () => {
      const event = new Event("visibilitychange");
      document.dispatchEvent(event);

      await new Promise((resolve) => setTimeout(resolve, 500));
      next();
    },
  });

  return (
    <PresentWrapper>
      <DefaultLayout
        heading="You're all set!"
        seoTitle="You're all set!"
        description="That's everything for now, you're ready to start using Quenti."
        action="Done"
        nextLoading={startedLoading}
        onNext={async () => {
          setStartedLoading(true);
          await completeOnboarding.mutateAsync();
        }}
      />
    </PresentWrapper>
  );
};
