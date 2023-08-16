import { useSession } from "next-auth/react";
import React from "react";

import { Link } from "@quenti/components";
import { api } from "@quenti/trpc";

import {
  Box,
  Button,
  Card,
  Center,
  Flex,
  HStack,
  Heading,
  IconButton,
  Spinner,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";

import {
  IconFolder,
  IconFolderPlus,
  IconMinus,
  IconPlus,
} from "@tabler/icons-react";

import { Modal } from "../../components/modal";
import { menuEventChannel } from "../../events/menu";
import { useSet } from "../../hooks/use-set";

export interface AddToFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddToFolderModal: React.FC<AddToFolderModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { id } = useSet();

  const { data, isLoading, refetch } = api.folders.recentForSetAdd.useQuery(
    { studySetId: id },
    {
      enabled: isOpen,
    },
  );

  React.useEffect(() => {
    const onFolderCreated = (setId: string) => {
      if (setId !== id) return;
      void (async () => {
        await refetch();
      })();
    };

    menuEventChannel.on("folderWithSetCreated", onFolderCreated);
    return () => {
      menuEventChannel.off("folderWithSetCreated", onFolderCreated);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Body>
          <Stack spacing={8}>
            <Modal.Heading>Add to folder</Modal.Heading>
            <Stack spacing={3}>
              {isLoading ? (
                <Center w="full" py="3">
                  <Spinner color="blue.200" />
                </Center>
              ) : (
                <Button
                  w="full"
                  variant="outline"
                  h="14"
                  colorScheme="gray"
                  leftIcon={<IconPlus size={18} />}
                  onClick={() => {
                    menuEventChannel.emit("createFolder", id);
                  }}
                >
                  Add to new folder
                </Button>
              )}
              {data?.map((folder) => (
                <FolderCard
                  id={folder.id}
                  key={folder.id}
                  title={folder.title}
                  slug={folder.slug}
                  includes={folder.includes}
                />
              ))}
            </Stack>
          </Stack>
        </Modal.Body>
        <Modal.Divider />
        <Modal.Footer>
          <Button onClick={onClose}>Done</Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};

interface FolderCardProps {
  id: string;
  title: string;
  slug: string | null;
  includes: boolean;
}

const FolderCard: React.FC<FolderCardProps> = ({
  id: folderId,
  title,
  slug,
  includes: _includes,
}) => {
  const user = useSession()!.data!.user!;
  const { id } = useSet();

  const [includes, setIncludes] = React.useState(_includes);
  React.useEffect(() => setIncludes(_includes), [_includes]);

  const addSets = api.folders.addSets.useMutation();
  const removeSet = api.folders.removeSet.useMutation();

  const cardBg = useColorModeValue("gray.50", "gray.750");

  const adding =
    addSets.isLoading && addSets.variables?.studySetIds.includes(id);
  const removing =
    removeSet.isLoading && removeSet.variables?.studySetId === id;

  return (
    <Card
      bg={cardBg}
      px="4"
      py="3"
      borderColor="gray.100"
      _dark={{
        borderColor: "gray.700",
      }}
      borderWidth="2px"
      rounded="lg"
      shadow="sm"
      role="group"
    >
      <Flex justifyContent="space-between" gap={4}>
        <HStack spacing={4} overflow="hidden">
          <Box color="gray.500">
            <IconFolder size={18} />
          </Box>
          <Link
            href={`/@${user.username}/folders/${slug ?? folderId}`}
            transition="color ease-in-out 150ms"
            _hover={{
              color: "blue.200",
            }}
            minWidth={0}
          >
            <Heading
              size="md"
              whiteSpace="nowrap"
              textOverflow="ellipsis"
              overflow="hidden"
            >
              {title}
            </Heading>
          </Link>
        </HStack>
        <IconButton
          icon={includes ? <IconMinus /> : <IconFolderPlus />}
          onClick={async () => {
            setIncludes(!includes);

            if (!includes) {
              await addSets.mutateAsync({
                folderId,
                studySetIds: [id],
              });
            } else {
              await removeSet.mutateAsync({
                folderId,
                studySetId: id,
              });
            }
          }}
          isLoading={adding || removing}
          aria-label="add"
          variant="ghost"
          size="sm"
        />
      </Flex>
    </Card>
  );
};
