import React from "react";

import { Modal } from "@quenti/components/modal";
import { allEqual } from "@quenti/lib/array";
import { avatarUrl } from "@quenti/lib/avatar";
import type { User } from "@quenti/prisma/client";
import { api } from "@quenti/trpc";

import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  ButtonGroup,
  HStack,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

import { IconArrowRight } from "@tabler/icons-react";

import { useClass } from "../../hooks/use-class";
import { SectionSelect } from "./section-select";
import { addressStudents } from "./utils/address-students";

export interface ChangeSectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: {
    id: string;
    user: Pick<User, "id" | "name" | "username" | "image">;
    section?: {
      id: string;
      name: string;
    };
  }[];
}

export const ChangeSectionModal: React.FC<ChangeSectionModalProps> = ({
  isOpen,
  onClose,
  members,
}) => {
  const utils = api.useUtils();
  const { data: class_ } = useClass();

  const multiple = !members.length || members.length > 1;
  const currentSection = multiple
    ? allEqual(members.map((u) => u.section?.id))
      ? members[0]?.section ?? { id: "", name: "Unassigned" }
      : { id: "", name: "Various sections" }
    : members[0]?.section ?? { id: "", name: "Unassigned" };

  const updateStudents = api.classes.updateStudents.useMutation({
    onSuccess: async () => {
      await utils.classes.getStudents.invalidate();
      await utils.classes.get.invalidate();
      onClose();
    },
  });

  const defaultColor = useColorModeValue("gray.900", "gray.50");
  const muted = useColorModeValue("gray.600", "gray.400");

  const [section, setSection] = React.useState<string | undefined>();

  React.useEffect(() => {
    if (!isOpen) return;
    const firstOtherSection = class_!.sections!.find(
      (s) => s.id !== currentSection.id,
    )!;
    setSection(firstOtherSection?.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const switcher = (
    <HStack spacing="2" color={muted}>
      <Text fontSize="sm">{currentSection.name}</Text>
      <IconArrowRight size={18} />
      <Box color={defaultColor} w="150px">
        <SectionSelect
          value={section || ""}
          onChange={setSection}
          sections={class_!.sections!.filter((s) => s.id !== currentSection.id)}
          size="sm"
        />
      </Box>
    </HStack>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Body>
          <Modal.Heading>Change section</Modal.Heading>
          <Text color={muted}>
            {addressStudents(multiple, members[0]?.user.name)} will no longer
            have access to previous assignments and content in their current
            section.
          </Text>
          {multiple ? (
            <Stack spacing="4">
              <HStack spacing="3">
                <AvatarGroup size="sm" max={10} spacing="-6px">
                  {members.map((user) => (
                    <Avatar key={user.id} src={avatarUrl(user.user)} />
                  ))}
                </AvatarGroup>
              </HStack>
              {switcher}
            </Stack>
          ) : (
            <>
              <HStack spacing="4">
                <Avatar src={avatarUrl(members[0]!.user)} size="sm" />
                {switcher}
              </HStack>
            </>
          )}
        </Modal.Body>
        <Modal.Divider />
        <Modal.Footer>
          <ButtonGroup>
            <Button colorScheme="gray" onClick={onClose} variant="ghost">
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              isLoading={updateStudents.isLoading}
              onClick={async () => {
                if (!section) return;
                await updateStudents.mutateAsync({
                  classId: class_!.id,
                  sectionId: section,
                  members: members.map((m) => m.id),
                });
              }}
            >
              Change section
            </Button>
          </ButtonGroup>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};
