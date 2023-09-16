import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";

import { Modal } from "@quenti/components/modal";
import { api } from "@quenti/trpc";

import { Button, ButtonGroup, Input, Stack } from "@chakra-ui/react";

import { menuEventChannel } from "../events/menu";
import { useTelemetry } from "../lib/telemetry";
import { AutoResizeTextarea } from "./auto-resize-textarea";

export interface CreateFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  childSetId?: string;
}

export const CreateFolderModal: React.FC<CreateFolderModalProps> = ({
  isOpen,
  onClose,
  childSetId,
}) => {
  const { event } = useTelemetry();
  const router = useRouter();
  const session = useSession();

  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");

  const createFolder = api.folders.create.useMutation({
    onSuccess: async (data) => {
      void event("folder_created", {
        id: data.id,
      });

      if (!childSetId) {
        onClose();
        await router.push(
          `/@${session.data!.user!.username}/folders/${data.slug ?? data.id}`,
        );
      } else {
        menuEventChannel.emit("folderWithSetCreated", childSetId);
        onClose();
      }

      setTitle("");
      setDescription("");
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered={false}>
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Body>
          <Modal.Heading>Create folder</Modal.Heading>
          <Stack spacing={4}>
            <Input
              placeholder="Title"
              variant="flushed"
              fontWeight={700}
              bg="gray.100"
              px="14px"
              _dark={{
                bg: "gray.700",
              }}
              rounded="lg"
              value={title}
              isInvalid={createFolder.isError}
              onChange={(e) => setTitle(e.target.value)}
            />
            <AutoResizeTextarea
              allowTab={false}
              placeholder="Description (optional)"
              py="3"
              border="none"
              bg="gray.50"
              _dark={{
                bg: "gray.750",
              }}
              minH="100px"
              value={description}
              size="sm"
              rounded="lg"
              onChange={(e) => setDescription(e.target.value)}
            />
          </Stack>
        </Modal.Body>
        <Modal.Divider />
        <Modal.Footer>
          <ButtonGroup gap={2}>
            <Button variant="ghost" colorScheme="gray" onClick={onClose}>
              Cancel
            </Button>
            <Button
              isLoading={createFolder.isLoading}
              onClick={async () => {
                await createFolder.mutateAsync({
                  title,
                  description,
                  setId: childSetId,
                });
              }}
            >
              Create
            </Button>
          </ButtonGroup>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};

export default CreateFolderModal;
