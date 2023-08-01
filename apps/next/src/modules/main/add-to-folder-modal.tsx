import {
  Box,
  Button,
  Card,
  Center,
  Flex,
  Heading,
  HStack,
  IconButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
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
import { useSession } from "next-auth/react";
import React from "react";
import { Link } from "../../components/link";
import { menuEventChannel } from "../../events/menu";
import { useSet } from "../../hooks/use-set";
import { api } from "../../utils/api";

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
    }
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

  const borderColor = useColorModeValue("gray.200", "gray.800");
  const secondaryBg = useColorModeValue("gray.50", "gray.750");

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      isCentered
      scrollBehavior="inside"
    >
      <ModalOverlay backdropFilter="blur(6px)" />
      <ModalContent rounded="xl" overflow="hidden">
        <ModalBody p="6" px="8">
          <Stack spacing={8}>
            <Heading fontSize="4xl">Add to Folder</Heading>
            <Stack spacing={3}>
              {isLoading ? (
                <Center w="full" py="3">
                  <Spinner color="blue.200" />
                </Center>
              ) : (
                <Button
                  w="full"
                  variant="outline"
                  leftIcon={<IconPlus />}
                  size="lg"
                  onClick={() => {
                    menuEventChannel.emit("createFolder", id);
                  }}
                >
                  Add to new Folder
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
        </ModalBody>
        <ModalFooter
          bg={secondaryBg}
          borderTopColor={borderColor}
          borderTopWidth="2px"
        >
          <Button onClick={onClose}>Done</Button>
        </ModalFooter>
      </ModalContent>
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

  const cardBg = useColorModeValue("gray.100", "gray.750");
  const highlight = useColorModeValue("blue.400", "blue.200");

  const adding =
    addSets.isLoading && addSets.variables?.studySetIds.includes(id);
  const removing =
    removeSet.isLoading && removeSet.variables?.studySetId === id;

  return (
    <Card
      bg={cardBg}
      px="4"
      py="3"
      borderBottomWidth="2px"
      borderBottomColor={cardBg}
      transition="border-bottom-color ease-in-out 150ms"
      _hover={{
        borderBottomColor: "blue.300",
      }}
      role="group"
    >
      <Flex justifyContent="space-between" gap={4}>
        <HStack spacing={4} overflow="hidden">
          <Box
            _groupHover={{ transform: "translateX(2px)" }}
            transition="transform ease-in-out 150ms"
          >
            <IconFolder size={18} />
          </Box>
          <Link
            href={`/@${user.username}/folders/${slug ?? folderId}`}
            transition="color ease-in-out 150ms"
            _hover={{
              color: highlight,
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
