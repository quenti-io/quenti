import type { ComponentWithAuth } from "../../components/auth-component";
import { OnboardingSubscribe } from "../../modules/onboarding/onboarding-subscribe";

const Page: ComponentWithAuth = () => {
  return <OnboardingSubscribe />;
};

Page.title = "Quenti | Subscribe to updates";
Page.authenticationEnabled = true;

export default Page;
