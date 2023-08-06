import { Skeleton } from "@chakra-ui/react";
import { ClassCard } from "../../../components/class-card";
import { WizardLayout } from "../../../components/wizard-layout";
import { useClass } from "../../../hooks/use-class";

export default function OnboardingDone() {
  const { data } = useClass();

  return (
    <WizardLayout
      title="You're all set!"
      description="Your class is now ready to go."
      steps={4}
      currentStep={3}
    >
      <Skeleton isLoaded={!!data} rounded="md">
        <ClassCard
          id={data?.id || ""}
          name={data?.name || ""}
          data={{ students: data?.students, sections: data?.sections?.length }}
          for="Teacher"
        />
      </Skeleton>
    </WizardLayout>
  );
}
