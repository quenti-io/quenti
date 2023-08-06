import {
  Avatar,
  AvatarGroup,
  Button,
  ButtonGroup,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { avatarUrl } from "@quenti/lib/avatar";
import type { User } from "@quenti/prisma/client";
import { api } from "@quenti/trpc";
import { IconUserX } from "@tabler/icons-react";
import { Modal } from "../../components/modal";
import { useClass } from "../../hooks/use-class";
import { addressStudents } from "./utils/address-students";

export interface RemoveStudentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  users: Pick<User, "id" | "name" | "username" | "image">[];
}

export const RemoveStudentsModal: React.FC<RemoveStudentsModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  users,
}) => {
  const { data: class_ } = useClass();
  const utils = api.useContext();
  const multiple = !users.length || users.length > 1;

  const removeMembers = api.classes.removeMembers.useMutation({
    onSuccess: async () => {
      await utils.classes.getStudents.invalidate();
      await utils.classes.get.invalidate();
      onSuccess();
    },
  });

  const muted = useColorModeValue("gray.600", "gray.400");

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Body>
          <Modal.Heading>Remove student{multiple && "s"}</Modal.Heading>
          <Text color={muted}>
            {addressStudents(multiple, users[0]?.name)} will be permanently
            removed from the class and all of their content will be deleted.
            They will no longer be able to access the class until they rejoin or
            are manually readded.
          </Text>
          {multiple && (
            <AvatarGroup size="sm" max={10} spacing="-6px">
              {users.map((user) => (
                <Avatar key={user.id} src={avatarUrl(user)} />
              ))}
            </AvatarGroup>
          )}
        </Modal.Body>
        <Modal.Divider />
        <Modal.Footer>
          <ButtonGroup>
            <Button variant="ghost" colorScheme="gray" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="outline"
              colorScheme="red"
              leftIcon={<IconUserX size={18} />}
              isLoading={removeMembers.isLoading}
              onClick={() =>
                removeMembers.mutate({
                  id: class_!.id,
                  users: users.map((user) => user.id),
                })
              }
            >
              {multiple ? `Remove ${users.length} students` : "Remove student"}
            </Button>
          </ButtonGroup>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};
