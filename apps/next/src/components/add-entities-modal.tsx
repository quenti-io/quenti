import React from "react";

import { Modal } from "@quenti/components/modal";
import type { SetFolderEntity } from "@quenti/interfaces";

import {
  Button,
  ButtonGroup,
  Center,
  Grid,
  GridItem,
  Heading,
  Skeleton,
  Text,
  VStack,
} from "@chakra-ui/react";

import { GenericCollaboratorsFooter } from "./generic-collaborators-footer";
import { GhostGroup } from "./ghost-group";
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
                  <Skeleton rounded="lg">
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
                  type={entity.entityType}
                  title={entity.title}
                  numItems={entity.numItems}
                  user={entity.user}
                  selected={selectedIds.includes(entity.id)}
                  bottom={
                    entity.type === "Collab" ? (
                      <GenericCollaboratorsFooter
                        avatars={entity.collaborators?.avatars || []}
                        total={entity.collaborators?.total || 0}
                        emptyText="No collaborators"
                        darkBg="gray.750"
                      />
                    ) : undefined
                  }
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
              <VStack spacing="10">
                <GhostGroup />
                <VStack>
                  <Heading fontSize="2xl" fontWeight={600}>
                    Nothing to add
                  </Heading>
                  <Text color="gray.500">
                    Your study material will show up here.
                  </Text>
                </VStack>
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
