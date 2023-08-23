import { api } from "@quenti/trpc";

import { DefaultLayout } from "./default-layout";
import { PresentWrapper, useNextStep } from "./present-wrapper";

export const OnboardingDone = () => {
  const next = useNextStep();

  const completeOnboarding = api.user.completeOnboarding.useMutation({
    onSuccess: () => {
      const event = new Event("visibilitychange");
      document.dispatchEvent(event);
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
        nextLoading={completeOnboarding.isLoading}
        onNext={async () => {
          await completeOnboarding.mutateAsync();
        }}
      />
    </PresentWrapper>
  );
};
