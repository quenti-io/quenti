import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";

import { Modal } from "@quenti/components/modal";
import { api } from "@quenti/trpc";

import { Button, ButtonGroup, Input, Stack } from "@chakra-ui/react";

import { AutoResizeTextarea } from "../../components/auto-resize-textarea";
import { useFolder } from "../../hooks/use-folder";

export interface EditFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EditFolderModal: React.FC<EditFolderModalProps> = ({
  isOpen,
  onClose,
}) => {
  const utils = api.useUtils();
  const router = useRouter();
  const session = useSession();
  const folder = useFolder();

  const [title, setTitle] = React.useState(folder.title);
  const [description, setDescription] = React.useState(folder.description);

  const editFolder = api.folders.edit.useMutation({
    onSuccess: async (data) => {
      await router.push(
        `/@${session.data!.user!.username}/folders/${data.slug ?? data.id}`,
      );

      onClose();
      await utils.folders.invalidate();
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Body>
          <Modal.Heading>Edit folder</Modal.Heading>
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
          <ButtonGroup>
            <Button variant="ghost" colorScheme="gray" onClick={onClose}>
              Cancel
            </Button>
            <Button
              isLoading={editFolder.isLoading}
              onClick={async () => {
                await editFolder.mutateAsync({
                  folderId: folder.id,
                  title,
                  description,
                });
              }}
            >
              Save
            </Button>
          </ButtonGroup>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};
