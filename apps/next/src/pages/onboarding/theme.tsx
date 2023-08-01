import type { ComponentWithAuth } from "../../components/auth-component";
import { OnboardingTheme } from "../../modules/onboarding/onboarding-theme";

const Page: ComponentWithAuth = () => {
  return <OnboardingTheme />;
};

Page.title = "Quenti | Onboarding";
Page.authenticationEnabled = true;

export default Page;
