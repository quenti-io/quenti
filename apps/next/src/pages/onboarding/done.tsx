import type { ComponentWithAuth } from "../../components/auth-component";
import { OnboardingDone } from "../../modules/onboarding/onboarding-done";

const Page: ComponentWithAuth = () => {
  return <OnboardingDone />;
};

Page.title = "Quenti | Onboarding";
Page.authenticationEnabled = true;

export default Page;

