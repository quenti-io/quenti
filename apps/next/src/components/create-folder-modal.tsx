import {
  Button,
  ButtonGroup,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import { menuEventChannel } from "../events/menu";
import { api } from "../utils/api";
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
  const router = useRouter();
  const session = useSession();
  const primaryBg = useColorModeValue("gray.200", "gray.800");
  const secondaryBg = useColorModeValue("gray.100", "gray.750");
  const headingColor = useColorModeValue("gray.800", "whiteAlpha.900");
  const inputColor = useColorModeValue("gray.800", "whiteAlpha.900");

  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");

  const createFolder = api.folders.create.useMutation({
    onSuccess: async (data) => {
      if (!childSetId) {
        onClose();
        await router.push(
          `/@${session.data!.user!.username}/folders/${data.slug ?? data.id}`
        );
      } else {
        menuEventChannel.emit("folderWithSetCreated", childSetId);
        onClose();
      }
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay backdropFilter="blur(6px)" />
      <ModalContent p="4" pb="4" rounded="xl">
        <ModalBody>
          <Stack spacing={8}>
            <Heading fontSize="4xl" color={headingColor}>
              Create Folder
            </Heading>
            <Stack spacing={4}>
              <Input
                placeholder="Title"
                variant="flushed"
                fontWeight={700}
                bg={primaryBg}
                color={inputColor}
                rounded="md"
                px="4"
                size="lg"
                value={title}
                isInvalid={createFolder.isError}
                onChange={(e) => setTitle(e.target.value)}
              />
              <AutoResizeTextarea
                allowTab={false}
                placeholder="Description (optional)"
                bg={secondaryBg}
                color={inputColor}
                py="3"
                border="none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Stack>
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
                  setId: childSetId,
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
