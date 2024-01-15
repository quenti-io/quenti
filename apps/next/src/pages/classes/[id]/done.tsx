import { Skeleton } from "@chakra-ui/react";

import { PageWrapper } from "../../../common/page-wrapper";
import { ClassCard } from "../../../components/class-card";
import { WizardLayout } from "../../../components/wizard-layout";
import { useClass } from "../../../hooks/use-class";
import { getLayout } from "../../../layouts/main-layout";
import { useProtectedRedirect } from "../../../modules/classes/use-protected-redirect";

export default function OnboardingDone() {
  const { data } = useClass();
  const isLoaded = useProtectedRedirect();

  return (
    <WizardLayout
      title="You're all set!"
      seoTitle="You're all set!"
      description="Your class is now ready to go."
      steps={4}
      currentStep={3}
    >
      <Skeleton isLoaded={isLoaded} rounded="lg">
        <ClassCard
          id={data?.id || ""}
          name={data?.name || ""}
          bannerColor={data?.bannerColor || ""}
          logo={data?.logoUrl || ""}
          hash={data?.logoHash}
          data={{ students: data?.students, sections: data?.sections?.length }}
          for="Teacher"
        />
      </Skeleton>
    </WizardLayout>
  );
}

OnboardingDone.PageWrapper = PageWrapper;
OnboardingDone.getLayout = getLayout;
