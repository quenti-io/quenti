import type { ComponentWithAuth } from "../../components/auth-component";
import { OnboardingIntro } from "../../modules/onboarding/onboarding-intro";

const Page: ComponentWithAuth = () => {
  return <OnboardingIntro />;
};

Page.title = "Welcome to Quenti";
Page.authenticationEnabled = true;

export default Page;
