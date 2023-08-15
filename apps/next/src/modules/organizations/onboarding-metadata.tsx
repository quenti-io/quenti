import React from "react";

import { type RouterInputs, api } from "@quenti/trpc";

export interface OnboardingMetadataProps {
  step: RouterInputs["organizations"]["setMemberMetadata"]["metadata"]["onboardingStep"];
}

export const OnboardingMetadata: React.FC<
  React.PropsWithChildren<OnboardingMetadataProps>
> = ({ step, children }) => {
  const setMemberMetadata = api.organizations.setMemberMetadata.useMutation();

  React.useEffect(() => {
    setMemberMetadata.mutate({
      metadata: {
        onboardingStep: step,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{children}</>;
};
