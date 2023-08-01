import { Button, Flex, Stack, Text, useColorModeValue } from "@chakra-ui/react";
import { IconReload } from "@tabler/icons-react";
import React from "react";
import { useSet } from "../../../hooks/use-set";
import { useSetPropertiesStore } from "../../../stores/use-set-properties-store";
import { api } from "@quenti/trpc";
import { LearnSettingsModalContext } from "../learn-settings-modal";

export const ResetProgressSection = () => {
  const { id } = useSet();
  const utils = api.useContext();
  const setIsDirty = useSetPropertiesStore((s) => s.setIsDirty);

  const { onClose, dirtyOnReset } = React.useContext(LearnSettingsModalContext);
  const mutedColor = useColorModeValue("gray.600", "gray.400");

  const apiResetLearnProgress = api.container.resetLearnProgress.useMutation({
    onSuccess: async () => {
      if (!dirtyOnReset) await utils.studySets.invalidate();
      onClose();
      if (dirtyOnReset) setIsDirty(true);
    },
  });

  return (
    <Flex gap={{ base: 4, sm: 8 }} flexDir={{ base: "column", sm: "row" }}>
      <Stack spacing={0} w="full">
        <Text fontWeight={700}>Start over</Text>
        <Text fontSize="sm" color={mutedColor}>
          Reset progress for this set
        </Text>
      </Stack>
      <Button
        px={{ base: undefined, sm: "12" }}
        w={{ base: "max", sm: "auto" }}
        variant="ghost"
        leftIcon={<IconReload />}
        isLoading={apiResetLearnProgress.isLoading}
        onClick={() => {
          apiResetLearnProgress.mutate({
            entityId: id,
          });
        }}
      >
        Reset Progress
      </Button>
    </Flex>
  );
};
