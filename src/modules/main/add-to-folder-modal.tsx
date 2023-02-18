import {
  Button,
  Card,
  Center,
  Flex,
  Heading,
  HStack,
  IconButton,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Spinner,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import { IconFolder, IconFolderPlus, IconMinus } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import React from "react";
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

  const { data, isLoading } = api.folders.recentForSetAdd.useQuery(id, {
    enabled: isOpen,
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      isCentered
      scrollBehavior="inside"
    >
      <ModalOverlay backdropFilter="blur(6px)" />
      <ModalContent p="4" pb="4" rounded="xl">
        <ModalBody>
          <Stack spacing={8}>
            <Heading fontSize="4xl">Add to Folder</Heading>
            <Stack spacing={3}>
              {data?.map((folder) => (
                <FolderCard
                  id={folder.id}
                  key={folder.id}
                  title={folder.title}
                  slug={folder.slug}
                  includes={folder.includes}
                />
              ))}
              {isLoading ? (
                <Center w="full" py="8">
                  <Spinner color="blue.200" />
                </Center>
              ) : undefined}
            </Stack>
          </Stack>
        </ModalBody>
        <ModalFooter>
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
  React.useEffect(() => setIncludes(includes), [includes]);

  const addSets = api.folders.addSets.useMutation();
  const removeSet = api.folders.removeSet.useMutation();

  const cardBg = useColorModeValue("gray.50", "gray.750");
  const border = useColorModeValue("gray.200", "gray.800");

  return (
    <Card
      bg={cardBg}
      px="4"
      py="3"
      borderWidth="2px"
      borderColor={border}
      transition="border-bottom-color ease-in-out 150ms"
      _hover={{
        borderBottomColor: "blue.300",
      }}
    >
      <Flex justifyContent="space-between">
        <HStack spacing={4}>
          <IconFolder size={18} />
          <Link href={`/@${user.username}/folders/${slug ?? id}`}>
            <Heading size="md">{title}</Heading>
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
          aria-label="add"
          variant="ghost"
          size="sm"
        />
      </Flex>
    </Card>
  );
};
