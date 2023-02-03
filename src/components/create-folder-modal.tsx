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
import { api } from "../utils/api";
import { AutoResizeTextarea } from "./auto-resize-textarea";

export interface CreateFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateFolderModal: React.FC<CreateFolderModalProps> = ({
  isOpen,
  onClose,
}) => {
  const router = useRouter();
  const session = useSession();
  const primaryBg = useColorModeValue("gray.200", "gray.800");
  const secondaryBg = useColorModeValue("gray.100", "gray.750");

  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");

  const createFolder = api.folders.create.useMutation({
    onSuccess: async (data) => {
      onClose();
      await router.push(
        `/@${session.data!.user!.username}/folders/${data.slug}`
      );
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent p="4" rounded="xl">
        <ModalHeader fontWeight={700} fontSize="3xl">
          Create Folder
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
              isLoading={createFolder.isLoading}
              onClick={async () => {
                await createFolder.mutateAsync({
                  title,
                  description,
                });
              }}
            >
              Create
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
