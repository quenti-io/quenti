import type { ComponentWithAuth } from "../../components/auth-component";
import { OnboardingInvites } from "../../modules/onboarding/onboarding-invites";

const Page: ComponentWithAuth = () => {
  return <OnboardingInvites />;
};

Page.title = "Quenti | Join organizations";
Page.authenticationEnabled = true;

export default Page;

