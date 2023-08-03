import {
  Button,
  ButtonGroup,
  Center,
  Grid,
  GridItem,
  Heading,
  HStack,
  Skeleton,
  Text,
  VStack,
} from "@chakra-ui/react";
import type { SetFolderEntity } from "@quenti/interfaces";
import { IconPlus } from "@tabler/icons-react";
import React from "react";
import { Modal } from "./modal";
import { SelectableGenericCard } from "./selectable-generic-card";

export interface AddEntitiesModal {
  isOpen: boolean;
  onClose: () => void;
  entities: SetFolderEntity[];
  onAdd: (ids: string[]) => void;
  actionLabel: string;
  isEntitiesLoading?: boolean;
  isAddLoading?: boolean;
}

export const AddEntitiesModal: React.FC<AddEntitiesModal> = ({
  isOpen,
  onClose,
  entities,
  onAdd,
  actionLabel,
  isEntitiesLoading = false,
  isAddLoading = false,
}) => {
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  React.useEffect(() => {
    setSelectedIds([]);
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered scrollBehavior="inside">
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Body>
          <Modal.Heading>{actionLabel}</Modal.Heading>
          <Grid gridTemplateColumns={{ base: "1fr", sm: "1fr 1fr" }} gap={4}>
            {isEntitiesLoading &&
              Array.from({ length: 10 }).map((_, i) => (
                <GridItem key={i}>
                  <Skeleton rounded="md">
                    <SelectableGenericCard
                      type="set"
                      title="loading"
                      numItems={12}
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
            {entities.map((entity) => (
              <GridItem key={entity.id}>
                <SelectableGenericCard
                  type={entity.type}
                  title={entity.title}
                  numItems={entity.numItems}
                  user={entity.user}
                  selected={selectedIds.includes(entity.id)}
                  onSelect={() => {
                    setSelectedIds((s) => {
                      if (s.includes(entity.id)) {
                        return s.filter((x) => x !== entity.id);
                      } else {
                        return [...s, entity.id];
                      }
                    });
                  }}
                />
              </GridItem>
            ))}
          </Grid>
          {!entities.length && !isEntitiesLoading && (
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
        </Modal.Body>
        <Modal.Divider />
        <Modal.Footer>
          <ButtonGroup>
            <Button onClick={onClose} variant="ghost" colorScheme="gray">
              Cancel
            </Button>
            <Button
              isLoading={isAddLoading}
              isDisabled={!selectedIds.length}
              onClick={() => onAdd(selectedIds)}
            >
              {actionLabel}
            </Button>
          </ButtonGroup>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};
