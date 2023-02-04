import {
  Button,
  ButtonGroup,
  Center,
  Grid,
  GridItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
} from "@chakra-ui/react";
import React from "react";
import { useFolder } from "../../hooks/use-folder";
import { api } from "../../utils/api";
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

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered scrollBehavior="inside">
      <ModalOverlay backdropFilter="blur(6px)" />
      <ModalContent>
        <ModalHeader fontWeight={700}>Add Sets</ModalHeader>
        <ModalBody pb="10">
          <Grid gridTemplateColumns="1fr 1fr" gap={4}>
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
          {recent.isLoading && (
            <Center>
              <Spinner color="blue.300" />
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
