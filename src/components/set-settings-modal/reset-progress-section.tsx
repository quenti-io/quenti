import { Flex, Stack, Text, Button, useColorModeValue } from "@chakra-ui/react";
import { IconReload } from "@tabler/icons-react";
import { useRouter } from "next/router";
import React from "react";
import { useSet } from "../../hooks/use-set";
import { api } from "../../utils/api";
import { SetSettingsModalContext } from "../set-settings-modal";

export const ResetProgressSection = () => {
  const { id } = useSet();
  const utils = api.useContext();
  const router = useRouter();

  const { onClose, reloadOnReset } = React.useContext(SetSettingsModalContext);
  const mutedColor = useColorModeValue("gray.600", "gray.400");

  const apiResetLearnProgress = api.experience.resetLearnProgress.useMutation({
    onSuccess: async () => {
      if (!reloadOnReset) await utils.studySets.invalidate();
      onClose();
      if (reloadOnReset) router.reload();
    },
  });

  return (
    <Flex gap={8}>
      <Stack spacing={0} w="full">
        <Text fontWeight={700}>Start over</Text>
        <Text fontSize="sm" color={mutedColor}>
          Reset progress for this set
        </Text>
      </Stack>
      <Button
        px="12"
        variant="ghost"
        leftIcon={<IconReload />}
        isLoading={apiResetLearnProgress.isLoading}
        onClick={() => {
          apiResetLearnProgress.mutate({
            studySetId: id,
          });
        }}
      >
        Reset Progress
      </Button>
    </Flex>
  );
};
