import {
  Divider,
  Flex,
  Heading,
  Kbd,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

export interface ShortcutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutModal: React.FC<ShortcutModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
      <ModalOverlay backdropFilter="blur(6px)" />
      <ModalContent p="4" pb="6" rounded="xl">
        <ModalBody>
          <Stack spacing={12}>
            <Heading fontSize="4xl">Keyboard Shortcuts</Heading>
            <Stack spacing={4}>
              <Shortcut
                name="Add card"
                label="Inserts below the current card"
                shortcut={
                  <span>
                    <Kbd>Ctrl</Kbd> + <Kbd>Shift</Kbd> + <Kbd>R</Kbd>
                  </span>
                }
              />
              <Divider />
              <Shortcut
                name="Next side or card"
                shortcut={
                  <span>
                    <Kbd>Tab</Kbd>
                  </span>
                }
              />
              <Divider />
              <Shortcut
                name="Move current card up/down"
                shortcut={
                  <span>
                    <Kbd>Alt</Kbd> + <Kbd>↑</Kbd> / <Kbd>↓</Kbd>
                  </span>
                }
              />
            </Stack>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

interface ShortcutProps {
  name: string;
  label?: string;
  shortcut: React.ReactNode;
}

const Shortcut: React.FC<ShortcutProps> = ({ name, label, shortcut }) => {
  const muted = useColorModeValue("gray.700", "gray.300");

  return (
    <Flex justifyContent="space-between" alignItems="start">
      <Stack spacing={0}>
        <Text fontSize="lg" fontWeight={600} fontFamily="Outfit">
          {name}
        </Text>
        {label && (
          <Text fontSize="sm" color={muted}>
            {label}
          </Text>
        )}
      </Stack>
      {shortcut}
    </Flex>
  );
};
