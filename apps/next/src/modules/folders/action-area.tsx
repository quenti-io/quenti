import {
  Button,
  ButtonGroup,
  Flex,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  Skeleton,
  Text,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  IconCards,
  IconDotsVertical,
  IconEdit,
  IconLayersSubtract,
  IconShare,
  IconTrash,
} from "@tabler/icons-react";
import { useRouter } from "next/router";
import React from "react";
import { ConfirmModal } from "../../components/confirm-modal";
import { Link } from "@quenti/components";
import { MenuOption } from "../../components/menu-option";
import { useFolder } from "../../hooks/use-folder";
import { api } from "@quenti/trpc";
import { EditFolderModal } from "./edit-folder-modal";
import { FolderCreatorOnly } from "./folder-creator-only";
import { ShareFolderModal } from "./share-folder-modal";

export const ActionArea = () => {
  const router = useRouter();
  const { id } = useFolder();
  const slug = router.query.slug as string;
  const folder = useFolder();

  const [editOpen, setEditOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [shareOpen, setShareOpen] = React.useState(false);

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
          deleteFolder.mutate({ folderId: id });
        }}
      />
      <EditFolderModal isOpen={editOpen} onClose={() => setEditOpen(false)} />
      <ShareFolderModal
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
      />
      <Flex justifyContent="space-between">
        <ButtonGroup size={{ base: "md", sm: "lg" }} gap={2}>
          <ButtonGroup size={{ base: "md", sm: "lg" }} gap={0}>
            <StudyButton folder={folder} slug={slug} mode="Flashcards" />
            <StudyButton folder={folder} slug={slug} mode="Match" />
          </ButtonGroup>
          <Button
            leftIcon={<IconShare />}
            variant="outline"
            onClick={() => setShareOpen(true)}
            colorScheme="gray"
          >
            Share
          </Button>
        </ButtonGroup>
        <HStack>
          <FolderCreatorOnly>
            <IconButton
              icon={<IconEdit />}
              variant="ghost"
              onClick={() => setEditOpen(true)}
              aria-label="Edit"
              rounded="full"
              size="sm"
            />
          </FolderCreatorOnly>
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
        </HStack>
      </Flex>
    </>
  );
};

interface StudyButtonProps {
  folder: ReturnType<typeof useFolder>;
  slug: string;
  mode: "Flashcards" | "Match";
}

const StudyButton: React.FC<StudyButtonProps> = ({ folder, slug, mode }) => {
  const icon = mode == "Flashcards" ? <IconCards /> : <IconLayersSubtract />;

  return (
    <Tooltip label={mode}>
      <span>
        <IconButton
          icon={icon}
          aria-label={mode}
          isDisabled={!folder.sets.length}
          as={!folder.sets.length ? undefined : Link}
          href={
            folder.sets.length
              ? `/@${
                  folder.user.username
                }/folders/${slug}/${mode.toLowerCase()}`
              : undefined
          }
        />
      </span>
    </Tooltip>
  );
};

ActionArea.Skeleton = function ActionAreaSkeleton() {
  return (
    <ButtonGroup size={{ base: "md", sm: "lg" }} gap={2}>
      <ButtonGroup size={{ base: "md", sm: "lg" }} gap={0}>
        <Skeleton fitContent rounded="md">
          <IconButton icon={<IconCards />} aria-label="Flashcards" />
        </Skeleton>
        <Skeleton fitContent rounded="md">
          <IconButton icon={<IconLayersSubtract />} aria-label="Match" />
        </Skeleton>
      </ButtonGroup>
      <Skeleton fitContent rounded="md">
        <Button leftIcon={<IconShare />} variant="outline" colorScheme="orange">
          Share
        </Button>
      </Skeleton>
    </ButtonGroup>
  );
};
