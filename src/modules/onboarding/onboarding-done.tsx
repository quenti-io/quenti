import { DefaultLayout } from "./default-layout";
import { PresentWrapper } from "./present-wrapper";

export const OnboardingDone = () => {
  return (
    <PresentWrapper step={6}>
      <DefaultLayout
        heading="You're all set!"
        description="That's everything for now, you're ready to start using Quenti."
        action="Go to dashboard"
        nextUrl="/home"
      />
    </PresentWrapper>
  );
};
