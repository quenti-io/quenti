import {
  Button,
  ButtonGroup,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import { AutoResizeTextarea } from "../../components/auto-resize-textarea";
import { useFolder } from "../../hooks/use-folder";
import { api } from "../../utils/api";

export interface EditFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EditFolderModal: React.FC<EditFolderModalProps> = ({
  isOpen,
  onClose,
}) => {
  const utils = api.useContext();
  const router = useRouter();
  const session = useSession();
  const folder = useFolder();

  const primaryBg = useColorModeValue("gray.200", "gray.800");
  const secondaryBg = useColorModeValue("gray.100", "gray.750");

  const [title, setTitle] = React.useState(folder.title);
  const [description, setDescription] = React.useState(folder.description);

  const editFolder = api.folders.edit.useMutation({
    onSuccess: async (data) => {
      await router.push(
        `/@${session.data!.user!.username}/folders/${data.slug}`
      );

      onClose();
      await utils.folders.invalidate();
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent p="4" rounded="xl">
        <ModalHeader fontWeight={700} fontSize="3xl">
          Edit Folder
        </ModalHeader>
        <ModalBody>
          <Stack spacing={4}>
            <Input
              placeholder="Title"
              variant="flushed"
              fontWeight={700}
              bg={primaryBg}
              rounded="md"
              px="4"
              size="lg"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <AutoResizeTextarea
              allowTab={false}
              placeholder="Description (optional)"
              bg={secondaryBg}
              py="4"
              border="none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Stack>
        </ModalBody>
        <ModalFooter>
          <ButtonGroup gap={2}>
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
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
