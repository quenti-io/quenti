import type { ComponentWithAuth } from "../../components/auth-component";
import { OnboardingCommandMenu } from "../../modules/onboarding/onboarding-command-menu";

const Page: ComponentWithAuth = () => {
  return <OnboardingCommandMenu />;
};

Page.title = "Quenti | Onboarding";
Page.authenticationEnabled = true;

export default Page;
