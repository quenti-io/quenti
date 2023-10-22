import { useSession } from "next-auth/react";
import React from "react";

import { api } from "@quenti/trpc";

import { useTelemetry } from "../../lib/telemetry";
import { DefaultLayout } from "./default-layout";
import { PresentWrapper, useNextStep } from "./present-wrapper";

export const OnboardingDone = () => {
  const { event } = useTelemetry();
  const { data: session, update } = useSession();
  const next = useNextStep();

  const [startedLoading, setStartedLoading] = React.useState(false);

  const completeOnboarding = api.user.completeOnboarding.useMutation({
    onSuccess: async () => {
      void event("onboarding_completed", {});
      await update();
    },
  });

  React.useEffect(() => {
    if (!session?.user?.completedOnboarding) return;
    next();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.completedOnboarding]);

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
