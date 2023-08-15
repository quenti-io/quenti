import { useRouter } from "next/router";
import React from "react";

import { Link } from "@quenti/components";
import { api } from "@quenti/trpc";

import { Button, Center, Heading, Stack, Text, VStack } from "@chakra-ui/react";

import { IconReload } from "@tabler/icons-react";

import { ConfirmModal } from "../../components/confirm-modal";
import { useAuthedSet } from "../../hooks/use-set";
import { useLearnContext } from "../../stores/use-learn-store";
import { TermMastery } from "./term-mastery";

export const CompletedView = () => {
  const { id, container } = useAuthedSet();
  const router = useRouter();
  const numTerms = useLearnContext((s) => s.allTerms).length;

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

  const [resetModalOpen, setResetModalOpen] = React.useState(false);

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
            You are about to reset your progress for <b>{numTerms}</b> term
            {numTerms != 1 ? "s" : ""}. This action cannot be undone.
          </Text>
        }
        isLoading={resetProgress.isLoading}
      />
      <Center minH={"calc(100vh - 240px)"}>
        <Stack spacing={20} pb="20">
          <Center>
            <TermMastery />
          </Center>
          <Stack textAlign="center" spacing={6}>
            <Heading>Congratulations, you&apos;ve learned everything!</Heading>
            {container.learnMode == "Learn" && (
              <Text fontSize="lg">
                Keep reviewing your most missed terms to make sure they stick.
              </Text>
            )}
          </Stack>
          <Center>
            <VStack w="max" gap={1}>
              {container.learnMode == "Learn" ? (
                <Button
                  size="lg"
                  isLoading={beginReview.isLoading}
                  onClick={async () => {
                    await beginReview.mutateAsync({ entityId: id });
                  }}
                >
                  Review Missed Terms
                </Button>
              ) : (
                <Button size="lg" as={Link} href={`/${id}`} w="full">
                  Finish Learn
                </Button>
              )}
              <Button
                size="lg"
                variant="ghost"
                w="full"
                leftIcon={<IconReload />}
                onClick={() => {
                  setResetModalOpen(true);
                }}
              >
                Reset Progress
              </Button>
            </VStack>
          </Center>
        </Stack>
      </Center>
    </>
  );
};
