import {
  Button,
  ButtonGroup,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  Text,
  useColorModeValue
} from "@chakra-ui/react";
import {
  IconCards,
  IconDotsVertical,
  IconEdit,
  IconTrash
} from "@tabler/icons-react";
import { useRouter } from "next/router";
import React from "react";
import { ConfirmModal } from "../../components/confirm-modal";
import { Link } from "../../components/link";
import { MenuOption } from "../../components/menu-option";
import { useFolder } from "../../hooks/use-folder";
import { api } from "../../utils/api";
import { EditFolderModal } from "./edit-folder-modal";
import { FolderCreatorOnly } from "./folder-creator-only";

export const ActionArea = () => {
  const router = useRouter();
  const { id } = useFolder();
  const slug = router.query.slug as string;
  const folder = useFolder();

  const [editOpen, setEditOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);

  const deleteFolder = api.folders.delete.useMutation({
    onSuccess: async () => {
      await router.push("/home");
    },
  });

  const menuBg = useColorModeValue("white", "gray.800");

  return (
    <>
      <ConfirmModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        heading="Delete this folder?"
        body={
          <Text>
            Are you sure you want to delete this folder? This action cannot be
            undone.
          </Text>
        }
        actionText="Delete"
        isLoading={deleteFolder.isLoading}
        onConfirm={() => {
          deleteFolder.mutate(id);
        }}
      />
      <EditFolderModal isOpen={editOpen} onClose={() => setEditOpen(false)} />
      <Flex justifyContent="space-between">
        <ButtonGroup size="lg" gap={2}>
          <Button
            leftIcon={<IconCards />}
            isDisabled={!folder.sets.length}
            as={Link}
            href={
              folder.sets.length
                ? `/@${folder.user.username}/folders/${slug}/flashcards`
                : ""
            }
          >
            Study
          </Button>
          <FolderCreatorOnly>
            <Button
              leftIcon={<IconEdit />}
              variant="ghost"
              colorScheme="orange"
              onClick={() => setEditOpen(true)}
            >
              Edit
            </Button>
          </FolderCreatorOnly>
        </ButtonGroup>
        <FolderCreatorOnly>
          <Menu placement="bottom-end">
            <MenuButton>
              <IconButton
                icon={<IconDotsVertical />}
                aria-label="Options"
                size="xs"
                variant="ghost"
                as="div"
              />
            </MenuButton>
            <MenuList bg={menuBg} py={0} overflow="hidden">
              <MenuOption
                icon={<IconTrash size={20} />}
                label="Delete"
                onClick={() => setDeleteOpen(true)}
              />
            </MenuList>
          </Menu>
        </FolderCreatorOnly>
      </Flex>
    </>
  );
};
