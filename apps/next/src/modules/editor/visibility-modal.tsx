import { Modal } from "@quenti/components/modal";
import type { StudySetVisibility } from "@quenti/prisma/client";

import {
  HStack,
  Heading,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

import { IconLink, IconLock, IconWorld } from "@tabler/icons-react";

import { ToggleGroup } from "../../components/toggle-group";

export interface VisibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  visibility: StudySetVisibility;
  onChangeVisibility: (visibility: StudySetVisibility) => void;
}

export const VisibilityModal: React.FC<VisibilityModalProps> = ({
  isOpen,
  onClose,
  visibility,
  onChangeVisibility,
}) => {
  const tabBorderColor = useColorModeValue("gray.200", "gray.700");
  const tabHoverColor = useColorModeValue("gray.50", "gray.750");

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Body pb="6">
          <Modal.Heading>Set visibility</Modal.Heading>
          <ToggleGroup
            index={
              visibility === "Public" ? 0 : visibility === "Unlisted" ? 1 : 2
            }
            orientation="vertical"
            tabBorderColor={tabBorderColor}
            tabHoverColor={tabHoverColor}
            tabProps={{
              borderBottomWidth: "2px",
              borderBottomColor: "gray.200",
              _last: {
                borderBottomWidth: 0,
              },
              _dark: {
                borderBottomColor: "gray.700",
              },
            }}
          >
            <ToggleGroup.Tab onClick={() => onChangeVisibility("Public")}>
              <VisibilityOption
                name="Public"
                description="Anyone can view and study this set, and it will be publicly available on your profile."
                icon={<IconWorld size={20} />}
                selected={visibility === "Public"}
              />
            </ToggleGroup.Tab>
            <ToggleGroup.Tab onClick={() => onChangeVisibility("Unlisted")}>
              <VisibilityOption
                name="Unlisted"
                description="Anyone can view and study this set via a direct link, but it will be hidden from your profile and not visible in folders."
                icon={<IconLink size={20} />}
                selected={visibility === "Unlisted"}
              />
            </ToggleGroup.Tab>
            <ToggleGroup.Tab onClick={() => onChangeVisibility("Private")}>
              <VisibilityOption
                name="Private"
                description="Only you can view and study this set."
                icon={<IconLock size={20} />}
                selected={visibility === "Private"}
              />
            </ToggleGroup.Tab>
          </ToggleGroup>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
};

interface VisbilityOptionProps {
  selected: boolean;
  name: string;
  icon: React.ReactNode;
  description: string;
}

const VisibilityOption: React.FC<VisbilityOptionProps> = ({
  selected,
  name,
  icon,
  description,
}) => {
  const grayText = useColorModeValue("gray.600", "gray.400");

  return (
    <Stack spacing="2" textAlign="left" w="full" py="3">
      <HStack spacing="2" transition="color 0.2s ease-in-out">
        {icon}
        <Heading size="md" fontWeight={600}>
          {name}
        </Heading>
      </HStack>
      <Text
        fontSize="sm"
        fontWeight={selected ? 600 : 400}
        color={selected ? undefined : grayText}
      >
        {description}
      </Text>
    </Stack>
  );
};
