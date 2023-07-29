import type { ComponentWithAuth } from "../../components/auth-component";
import { OnboardingAccountType } from "../../modules/onboarding/onboarding-account-tyoe";

const Page: ComponentWithAuth = () => {
  return <OnboardingAccountType />;
};

Page.title = "Quenti | Onboarding";
Page.authenticationEnabled = true;

export default Page;
