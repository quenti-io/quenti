import { useRouter } from "next/router";
import React from "react";

import { api } from "@quenti/trpc";

import { Button, Skeleton, Stack } from "@chakra-ui/react";

import { IconArrowRight } from "@tabler/icons-react";

import { useAssignment } from "../../../hooks/use-assignment";
import { CollabTermsSlider } from "../assignments/editor/collab-terms-slider";
import { ClassWizardLayout } from "../class-wizard-layout";
import { useProtectedRedirect } from "../use-protected-redirect";

export const AssignmentCollab = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const assignmentId = router.query.assignmentId as string;

  const { data: assignment } = useAssignment();
  const _isLoaded = useProtectedRedirect();
  const isLoaded = _isLoaded && !!assignment;

  const editCollab = api.assignments.editCollab.useMutation({
    onSuccess: async () => {
      await router.push(`/classes/${id}/assignments/${assignmentId}/publish`);
    },
  });

  const [minTerms, setMinTerms] = React.useState(3);
  const [maxTerms, setMaxTerms] = React.useState(7);

  React.useEffect(() => {
    if (!isLoaded) return;
    setMinTerms(assignment?.studySet?.collab?.minTermsPerUser ?? 3);
    setMaxTerms(assignment?.studySet?.collab?.maxTermsPerUser ?? 7);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  return (
    <ClassWizardLayout
      title="Edit Collab"
      seoTitle="Edit Collab"
      currentStep={2}
      steps={4}
      description="Configure how you would like students to collaborate on your study set."
      isLoaded={isLoaded}
    >
      <Stack spacing="10">
        <CollabTermsSlider
          isLoaded={isLoaded}
          minTerms={minTerms}
          maxTerms={maxTerms}
          onChange={(min, max) => {
            setMinTerms(min);
            setMaxTerms(max);
          }}
        />
        <Skeleton isLoaded={isLoaded} rounded="lg" fitContent alignSelf="end">
          <Button
            w="max"
            rightIcon={<IconArrowRight size={18} />}
            isLoading={editCollab.isLoading}
            onClick={() => {
              editCollab.mutate({
                id: assignment!.studySet!.collab!.id,
                type: "Default",
                minTermsPerUser: minTerms,
                maxTermsPerUser: maxTerms,
              });
            }}
          >
            Next
          </Button>
        </Skeleton>
      </Stack>
    </ClassWizardLayout>
  );
};
