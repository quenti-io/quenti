import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";

import { avatarUrl } from "@quenti/lib/avatar";
import { api } from "@quenti/trpc";

import {
  Avatar,
  Button,
  ButtonGroup,
  Center,
  Flex,
  HStack,
  Heading,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  Skeleton,
  SkeletonText,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

import {
  IconDotsVertical,
  IconEditCircle,
  IconFolder,
  IconShare,
  IconTrash,
} from "@tabler/icons-react";

import { ConfirmModal } from "../../components/confirm-modal";
import { MenuOption } from "../../components/menu-option";
import { UsernameLink } from "../../components/username-link";
import { useFolder } from "../../hooks/use-folder";
import { plural } from "../../utils/string";
import { EditFolderModal } from "./edit-folder-modal";
import { FolderCreatorOnly } from "./folder-creator-only";
import { ShareFolderModal } from "./share-folder-modal";

export const FolderHeading = () => {
  const folder = useFolder();
  const { data: session } = useSession();
  const router = useRouter();
  const { id } = folder;

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
        destructive
      />
      <EditFolderModal isOpen={editOpen} onClose={() => setEditOpen(false)} />
      <ShareFolderModal
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
      />
      <HStack
        flexDir={{ base: "column", md: "row" }}
        justifyContent="space-between"
        alignItems={{ base: "start", md: "end" }}
        spacing={{ base: 8, md: 4 }}
      >
        <Stack spacing="3">
          <Heading size="2xl" overflowWrap="anywhere">
            {folder.title}
          </Heading>
          <HStack spacing="4">
            <HStack>
              <Avatar width="20px" height="20px" src={avatarUrl(folder.user)} />
              <UsernameLink username={folder.user.username} />
            </HStack>
            <HStack
              color="gray.700"
              _dark={{ color: "gray.300" }}
              spacing="6px"
            >
              <IconFolder size={18} />
              <Text>{plural(folder.sets.length, "set")}</Text>
            </HStack>
          </HStack>
        </Stack>
        {folder.user.id !== session?.user?.id && (
          <Button
            variant="outline"
            colorScheme="gray"
            leftIcon={<IconShare size={18} />}
            onClick={() => setShareOpen(true)}
          >
            Share
          </Button>
        )}
        <FolderCreatorOnly>
          <Menu placement="bottom-end">
            <ButtonGroup
              isAttached
              variant="outline"
              colorScheme="gray"
              role="group"
              tabIndex={-1}
            >
              <IconButton
                icon={<IconShare size={18} />}
                aria-label="Share"
                onClick={() => setShareOpen(true)}
              />
              <IconButton
                icon={<IconEditCircle size={18} />}
                aria-label="Edit"
                onClick={() => setEditOpen(true)}
              />
              <MenuButton as={IconButton} w="10" h="10" p="0">
                <Center h="12">
                  <IconDotsVertical size={18} />
                </Center>
              </MenuButton>
              <MenuList
                bg={menuBg}
                py={0}
                overflow="hidden"
                minW="auto"
                w="40"
                zIndex={50}
              >
                <MenuOption
                  icon={<IconTrash size={20} />}
                  label="Delete"
                  onClick={() => setDeleteOpen(true)}
                />
              </MenuList>
            </ButtonGroup>
          </Menu>
        </FolderCreatorOnly>
      </HStack>
    </>
  );
};

FolderHeading.Skeleton = function FolderHeadingSkeleton() {
  const router = useRouter();
  const { username, slug } = router.query;

  const TextWrapper = ({ children }: { children: React.ReactNode }) => (
    <Flex alignItems="center" h="6">
      <SkeletonText
        noOfLines={1}
        skeletonHeight="18px"
        rounded="4px"
        overflow="hidden"
      >
        {children}
      </SkeletonText>
    </Flex>
  );

  return (
    <HStack
      flexDir={{ base: "column", md: "row" }}
      justifyContent="space-between"
      alignItems={{ base: "start", md: "end" }}
      spacing={{ base: 8, md: 4 }}
    >
      <Stack spacing="3">
        <Flex alignItems="center" h="12">
          <SkeletonText
            noOfLines={1}
            skeletonHeight="44px"
            rounded="lg"
            overflow="hidden"
          >
            <Heading size="2xl">
              {((slug || "Folder Title") as string).replace("-", " ")}
            </Heading>
          </SkeletonText>
        </Flex>
        <HStack spacing="4">
          <HStack>
            <Skeleton width="20px" height="20px" rounded="full" />
            <TextWrapper>
              <Text>{username}</Text>
            </TextWrapper>
          </HStack>
          <TextWrapper>
            <HStack
              color="gray.700"
              _dark={{ color: "gray.300" }}
              spacing="6px"
            >
              <IconFolder size={18} />
              <Text>5 sets</Text>
            </HStack>
          </TextWrapper>
        </HStack>
      </Stack>
    </HStack>
  );
};
