import type { ComponentWithAuth } from "../../components/auth-component";
import { OnboardingUsername } from "../../modules/onboarding/onboarding-username";

const Page: ComponentWithAuth = () => {
  return <OnboardingUsername />;
};

Page.title = "Quenti | Choose a username";
Page.authenticationEnabled = true;

export default Page;
