import {
  Button,
  ButtonGroup,
  Divider,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { IconReload } from "@tabler/icons-react";
import { Select } from "chakra-react-select";
import React from "react";

export interface SetSettingsModal {
  isOpen: boolean;
  onClose: () => void;
}

const options = [
  {
    label: "Term",
    value: "term",
  },
  {
    label: "Definition",
    value: "definition",
  },
  {
    label: "Both",
    value: "both",
  },
];

export const SetSettingsModal: React.FC<SetSettingsModal> = ({
  isOpen,
  onClose,
}) => {
  const [sortMethod, setSortMethod] = React.useState(options[0]!);

  const baseBg = useColorModeValue("gray.100", "gray.750");
  const dropdownBg = useColorModeValue("gray.200", "gray.700");
  const chevronColor = useColorModeValue("blue.400", "blue.200");
  const mutedColor = useColorModeValue("gray.600", "gray.400");

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
      <ModalOverlay backdropFilter="blur(6px)" />
      <ModalContent p="4" pb="8" rounded="xl">
        <ModalBody>
          <Stack spacing={6}>
            <Heading>Settings</Heading>
            <Flex gap={8}>
              <Stack spacing={0} w="full">
                <Text fontWeight={700}>Terms</Text>
                <Text fontSize="sm" color={mutedColor}>
                  Select which terms to study
                </Text>
              </Stack>
              <ButtonGroup isAttached>
                <Button variant="outline">All</Button>
                <Button>Starred</Button>
              </ButtonGroup>
            </Flex>
            <Divider />
            <Flex gap={8}>
              <Stack spacing={0} w="full">
                <Text fontWeight={700}>Study mode</Text>
                <Text fontSize="sm" color={mutedColor}>
                  Choose how to answer when studying
                </Text>
              </Stack>
              <Select
                selectedOptionStyle="check"
                value={sortMethod}
                onChange={(e) => {
                  setSortMethod(e!);
                }}
                chakraStyles={{
                  inputContainer: () => ({
                    width: 100,
                  }),
                  valueContainer: (provided) => ({
                    ...provided,
                    backgroundColor: baseBg,
                  }),
                  dropdownIndicator: (provided) => ({
                    ...provided,
                    paddingX: 2,
                    backgroundColor: dropdownBg,
                    color: chevronColor,
                  }),
                }}
                options={options}
              />
            </Flex>
            <Divider />p
            <Flex gap={8}>
              <Stack spacing={0} w="full">
                <Text fontWeight={700}>Danger zone</Text>
                <Text fontSize="sm" color={mutedColor}>
                  Reset progress for this set
                </Text>
              </Stack>
              <Button px="12" variant="ghost" leftIcon={<IconReload />}>
                Reset Progress
              </Button>
            </Flex>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
