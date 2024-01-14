import { useRouter } from "next/router";
import React from "react";

import { Modal } from "@quenti/components";
import { api } from "@quenti/trpc";

import {
  Box,
  Button,
  ButtonGroup,
  HStack,
  Text,
  chakra,
} from "@chakra-ui/react";

import { useAssignment } from "../../../hooks/use-assignment";
import { useClass } from "../../../hooks/use-class";

export interface DuplicateAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DuplicateAssignmentModal: React.FC<
  DuplicateAssignmentModalProps
> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const id = router.query.id as string;
  const { data: class_ } = useClass();
  const { data: assigmment } = useAssignment();
  const utils = api.useUtils();

  const duplicate = api.assignments.duplicate.useMutation({
    onSuccess: async () => {
      onClose();
      await router.push(`/classes/${id}/assignments`);
      await utils.assignments.feed.invalidate();
    },
  });

  const [sectionIds, setSectionIds] = React.useState<string[]>([]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Body>
          <Modal.Heading>Duplicate assignment</Modal.Heading>
          <Text
            color="gray.600"
            _dark={{
              color: "gray.400",
            }}
          >
            Choose which sections to copy{" "}
            <chakra.strong fontWeight={600}>{assigmment?.title}</chakra.strong>{" "}
            to
          </Text>
          <HStack spacing="3" flexWrap="wrap">
            {class_?.sections
              ?.filter((s) => s.id !== assigmment?.section.id)
              .map((section) => (
                <Box
                  key={section.id}
                  aria-selected={sectionIds.includes(section.id)}
                  display="inline-flex"
                  bg="gray.100"
                  transition="all 0.15s ease-in-out"
                  fontWeight={500}
                  whiteSpace="nowrap"
                  cursor="pointer"
                  _hover={{
                    bg: "gray.200",
                  }}
                  _dark={{
                    bg: "gray.750",
                    _hover: {
                      bg: "gray.700",
                    },
                  }}
                  outline="2px solid"
                  outlineColor={
                    sectionIds.includes(section.id) ? "blue.300" : "transparent"
                  }
                  py="6px"
                  px="3"
                  rounded="lg"
                  shadow="sm"
                  onClick={() => {
                    if (sectionIds.includes(section.id)) {
                      setSectionIds((x) => x.filter((y) => y != section.id));
                    } else {
                      setSectionIds((x) => [...x, section.id]);
                    }
                  }}
                >
                  {section.name}
                </Box>
              ))}
          </HStack>
        </Modal.Body>
        <Modal.Divider />
        <Modal.Footer>
          <ButtonGroup>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              isLoading={duplicate.isLoading}
              onClick={() => {
                duplicate.mutate({
                  classId: class_!.id,
                  id: assigmment!.id,
                  sectionIds,
                });
              }}
              isDisabled={sectionIds.length == 0}
            >
              Duplicate
            </Button>
          </ButtonGroup>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};
