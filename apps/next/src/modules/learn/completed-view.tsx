import { useRouter } from "next/router";
import React from "react";

import { Link } from "@quenti/components";
import { api } from "@quenti/trpc";

import { Button, Center, Heading, Stack, Text, VStack } from "@chakra-ui/react";

import { IconReload } from "@tabler/icons-react";

import { ConfirmModal } from "../../components/confirm-modal";
import { effectChannel } from "../../events/effects";
import { useAuthedSet } from "../../hooks/use-set";
import { useLearnContext } from "../../stores/use-learn-store";
import { plural } from "../../utils/string";
import { TermMastery } from "./term-mastery";

export const CompletedView = () => {
  const { id, container } = useAuthedSet();
  const router = useRouter();
  const numTerms = useLearnContext((s) => s.studiableTerms).length;
  const hasMissedTerms = useLearnContext((s) => s.hasMissedTerms) === true;

  const resetProgress = api.container.resetLearnProgress.useMutation({
    onSuccess() {
      router.reload();
    },
  });
  const beginReview = api.container.beginReview.useMutation({
    onSuccess() {
      router.reload();
    },
  });

  React.useEffect(() => {
    effectChannel.emit("confetti");
  }, []);

  const [resetModalOpen, setResetModalOpen] = React.useState(false);

  const canReview = container.learnMode == "Learn" && hasMissedTerms;

  return (
    <>
      <ConfirmModal
        isOpen={resetModalOpen}
        onClose={() => {
          setResetModalOpen(false);
        }}
        onConfirm={async () => {
          await resetProgress.mutateAsync({ entityId: id });
        }}
        heading="Reset Progress"
        body={
          <Text>
            Are you sure you want to reset your progress for{" "}
            {plural(numTerms, "term")}?
          </Text>
        }
        isLoading={resetProgress.isLoading}
      />
      <Center minH={"calc(100vh - 240px)"}>
        <Stack spacing={20} pb="20">
          <Center>
            <TermMastery />
          </Center>
          <VStack textAlign="center" spacing={6}>
            <Heading>Congratulations, you&apos;ve learned everything!</Heading>
            {canReview && (
              <Text>
                Keep reviewing your most missed terms to make sure they stick.
              </Text>
            )}
          </VStack>
          <Center>
            <VStack w="max" spacing="3">
              {canReview ? (
                <Button
                  isLoading={beginReview.isLoading}
                  onClick={async () => {
                    await beginReview.mutateAsync({ entityId: id });
                  }}
                >
                  Review missed terms
                </Button>
              ) : (
                <Button as={Link} href={`/${id}`} w="full">
                  Finish Learn
                </Button>
              )}
              <Button
                variant="ghost"
                w="full"
                leftIcon={<IconReload size={18} />}
                onClick={() => {
                  setResetModalOpen(true);
                }}
              >
                Reset progress
              </Button>
            </VStack>
          </Center>
        </Stack>
      </Center>
    </>
  );
};
