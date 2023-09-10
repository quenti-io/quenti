import { Modal } from "@quenti/components/modal";

import { Flex, Kbd, Stack, Text, useColorModeValue } from "@chakra-ui/react";

export interface ShortcutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutModal: React.FC<ShortcutModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Body>
          <Modal.Heading>Keyboard shortcuts</Modal.Heading>
          <Shortcut
            name="Add card"
            label="Inserts below the current card"
            shortcut={
              <span>
                <Kbd>Ctrl</Kbd> + <Kbd>Shift</Kbd> + <Kbd>R</Kbd>
              </span>
            }
          />
          <Modal.BodySeparator />
          <Shortcut
            name="Next side or card"
            shortcut={
              <span>
                <Kbd>Tab</Kbd>
              </span>
            }
          />
          <Modal.BodySeparator />
          <Shortcut
            name="Move current card up/down"
            shortcut={
              <span>
                <Kbd>Alt</Kbd> + <Kbd>↑</Kbd> / <Kbd>↓</Kbd>
              </span>
            }
          />
        </Modal.Body>
      </Modal.Content>
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
        <Text fontSize="lg" fontWeight={700}>
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
