import {
  Button,
  ButtonGroup,
  Center,
  Grid,
  GridItem,
  Heading,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Skeleton,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { api } from "@quenti/trpc";
import { IconPlus } from "@tabler/icons-react";
import React from "react";
import { useFolder } from "../../hooks/use-folder";
import { SelectableStudySet } from "./selectable-study-set";

export interface AddSetsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddSetsModal: React.FC<AddSetsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const utils = api.useContext();
  const folder = useFolder();

  const recent = api.studySets.recent.useQuery(
    {
      exclude: folder.sets.map((x) => x.id),
    },
    {
      enabled: isOpen,
    }
  );

  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  React.useEffect(() => {
    setSelectedIds([]);
  }, [isOpen]);

  const addSets = api.folders.addSets.useMutation({
    onSuccess: async () => {
      onClose();
      await utils.folders.invalidate();
    },
  });

  const mainBg = useColorModeValue("gray.100", "gray.750");
  const mainBorder = useColorModeValue("gray.200", "gray.800");
  const skeletonStartColor = useColorModeValue("white", "gray.600");
  const skeletonEndColor = useColorModeValue("gray.50", "gray.700");

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      isCentered
      scrollBehavior="inside"
    >
      <ModalOverlay backdropFilter="blur(6px)" />
      <ModalContent>
        <ModalHeader fontWeight={700}>Add Sets</ModalHeader>
        <ModalBody
          py="10"
          bg={mainBg}
          borderTopColor={mainBorder}
          borderBottomColor={mainBorder}
          borderTopWidth={2}
          borderBottomWidth={2}
        >
          <Grid gridTemplateColumns={{ base: "1fr", sm: "1fr 1fr" }} gap={4}>
            {recent.isLoading &&
              Array.from({ length: 10 }).map((_, i) => (
                <GridItem key={i}>
                  <Skeleton
                    rounded="md"
                    startColor={skeletonStartColor}
                    endColor={skeletonEndColor}
                  >
                    <SelectableStudySet
                      studySet={{
                        id: "",
                        title: "loading",
                        visibility: "Public",
                      }}
                      numTerms={12}
                      user={{
                        image: "",
                        username: "username",
                      }}
                      selected={false}
                      onSelect={() => undefined}
                    />
                  </Skeleton>
                </GridItem>
              ))}
            {recent.data?.map((set) => (
              <GridItem key={set.id}>
                <SelectableStudySet
                  studySet={set}
                  numTerms={set._count.terms}
                  user={set.user}
                  selected={selectedIds.includes(set.id)}
                  onSelect={() => {
                    setSelectedIds((s) => {
                      if (s.includes(set.id)) {
                        return s.filter((x) => x !== set.id);
                      } else {
                        return [...s, set.id];
                      }
                    });
                  }}
                />
              </GridItem>
            ))}
          </Grid>
          {!recent.data?.length && !recent.isLoading && (
            <Center>
              <VStack>
                <HStack>
                  <IconPlus />
                  <Heading size="lg" fontWeight={600}>
                    Nothing to add
                  </Heading>
                </HStack>
                <Text color="gray.500">That&apos;s kinda sad.</Text>
              </VStack>
            </Center>
          )}
        </ModalBody>
        <ModalFooter>
          <ButtonGroup>
            <Button onClick={onClose} variant="ghost" colorScheme="gray">
              Cancel
            </Button>
            <Button
              isLoading={addSets.isLoading}
              isDisabled={!selectedIds.length}
              onClick={() => {
                addSets.mutate({
                  folderId: folder.id,
                  studySetIds: selectedIds,
                });
              }}
            >
              Add Sets
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
