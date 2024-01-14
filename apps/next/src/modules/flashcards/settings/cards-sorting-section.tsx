import { useSession } from "next-auth/react";

import { api } from "@quenti/trpc";

import { Flex, Stack, Switch, Text, useColorModeValue } from "@chakra-ui/react";

import { menuEventChannel } from "../../../events/menu";
import { useSetFolderUnison } from "../../../hooks/use-set-folder-unison";
import { useContainerContext } from "../../../stores/use-container-store";

export const CardsSortingSection = () => {
  const authed = useSession().status == "authenticated";
  const { id, entityType } = useSetFolderUnison();

  const [enableCardsSorting, setEnableCardsSorting] = useContainerContext(
    (s) => [s.enableCardsSorting, s.setEnableCardsSorting],
  );

  const apiEnableCardsSorting =
    api.container.setEnableCardsSorting.useMutation();

  const mutedColor = useColorModeValue("gray.600", "gray.400");

  return (
    <Flex gap={8}>
      <Stack spacing={1} w="full">
        <Text fontWeight={700} fontSize="lg">
          Sort flashcards
        </Text>
        <Text fontSize="sm" color={mutedColor}>
          Study your flashcards by sorting the ones you know. Leave this off to
          quickly review cards.
        </Text>
      </Stack>
      <Switch
        size="lg"
        isChecked={enableCardsSorting}
        onChange={(e) => {
          if (!authed) {
            menuEventChannel.emit("openSignup", {
              message:
                "Create an account for free to sort and study flashcards effectively",
            });
            return;
          }

          setEnableCardsSorting(e.target.checked);
          apiEnableCardsSorting.mutate({
            entityId: id,
            enableCardsSorting: e.target.checked,
            type: entityType == "set" ? "StudySet" : "Folder",
          });
        }}
      />
    </Flex>
  );
};
