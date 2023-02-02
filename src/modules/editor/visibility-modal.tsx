import {
  Button,
  Heading,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import type { StudySetVisibility } from "@prisma/client";
import { IconLink, IconLock, IconWorld } from "@tabler/icons-react";

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
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalBody>
          <Stack spacing={4} py="4" px="2">
            <VisibilityOption
              name="Public"
              description="Anyone can view and study this study set and it will be displayed on your profile."
              icon={<IconWorld />}
              selected={visibility === "Public"}
              onSelect={() => onChangeVisibility("Public")}
            />
            <VisibilityOption
              name="Unlisted"
              description="Anyone can view and study this study set via the link, but it will be hidden from your profile."
              icon={<IconLink />}
              selected={visibility === "Unlisted"}
              onSelect={() => onChangeVisibility("Unlisted")}
            />
            <VisibilityOption
              name="Private"
              description="Only you can view and study this study set."
              icon={<IconLock />}
              selected={visibility === "Private"}
              onSelect={() => onChangeVisibility("Private")}
            />
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

interface VisbilityOptionProps {
  selected: boolean;
  onSelect: () => void;
  name: string;
  icon: React.ReactNode;
  description: string;
}

const VisibilityOption: React.FC<VisbilityOptionProps> = ({
  selected,
  onSelect,
  name,
  icon,
  description,
}) => {
  const textColor = useColorModeValue("alpha.900", "alpha.100");
  const blueColor = useColorModeValue("blue.400", "blue.300");
  const grayText = useColorModeValue("gray.700", "gray.300");

  return (
    <Button
      variant={selected ? "solid" : "outline"}
      onClick={onSelect}
      whiteSpace="normal"
      h="max-content"
      py="4"
      textAlign="left"
      justifyContent="start"
      textColor={!selected ? textColor : undefined}
      borderColor={blueColor}
      shadow="md"
    >
      <Stack spacing={2}>
        <HStack spacing={2}>
          {icon}
          <Heading size="md">{name}</Heading>
        </HStack>
        <Text
          fontSize="md"
          lineHeight="normal"
          fontWeight="normal"
          color={selected ? textColor : grayText}
        >
          {description}
        </Text>
      </Stack>
    </Button>
  );
};
