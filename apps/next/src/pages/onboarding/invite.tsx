import type { ComponentWithAuth } from "../../components/auth-component";
import { OnboardingInvite } from "../../modules/onboarding/onboarding-invite";

const Page: ComponentWithAuth = () => {
  return <OnboardingInvite />;
};

Page.title = "Quenti | Join organization";
Page.authenticationEnabled = true;

export default Page;
