import {
  Button,
  ButtonGroup,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { api } from "../../utils/api";

export interface RegexModalProps {
  isOpen: boolean;
  onClose: () => void;
  regex?: string;
}

export const RegexModal: React.FC<RegexModalProps> = ({
  isOpen,
  onClose,
  regex: _regex,
}) => {
  const utils = api.useContext();

  const emails = api.admin.getWhitelist.useQuery();
  const regexes = emails?.data?.regexes ?? [];

  const onSuccess = async () => {
    onClose();
    await utils.admin.getWhitelist.invalidate();
  };

  const addRegex = api.admin.addRegex.useMutation({
    onSuccess,
  });
  const editRegex = api.admin.editRegex.useMutation({
    onSuccess,
  });

  const [regex, setRegex] = React.useState("");
  const [label, setLabel] = React.useState("");

  React.useEffect(() => {
    if (!isOpen) return;

    setRegex(_regex || "");
    setLabel(_regex ? regexes.find((x) => x.regex == _regex)?.label || "" : "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const isValid = (r: string) => {
    try {
      new RegExp(r);
      return true;
    } catch (e) {
      return false;
    }
  };

  const primaryBg = useColorModeValue("gray.200", "gray.800");
  const secondaryBg = useColorModeValue("gray.100", "gray.750");
  const inputColor = useColorModeValue("gray.800", "whiteAlpha.900");

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
      <ModalOverlay backdropFilter="blur(6px)" />
      <ModalContent p="4" pb="4" rounded="xl">
        <ModalBody>
          <Stack spacing={8}>
            <Heading fontSize="3xl">{_regex ? "Edit" : "Add"} Regex</Heading>
            <Stack spacing={4}>
              <Input
                placeholder="Regular Expression"
                variant="flushed"
                fontWeight={700}
                bg={primaryBg}
                color={inputColor}
                rounded="md"
                px="4"
                size="lg"
                fontFamily="monospace"
                isInvalid={!isValid(regex)}
                value={regex}
                onChange={(e) => setRegex(e.target.value)}
              />
              <Input
                placeholder="Label"
                rounded="md"
                border="none"
                bg={secondaryBg}
                color={inputColor}
                value={label}
                onChange={(e) => setLabel(e.target.value)}
              />
            </Stack>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <ButtonGroup gap={2}>
            <Button variant="ghost" colorScheme="gray" onClick={onClose}>
              Cancel
            </Button>
            <Button
              isDisabled={!isValid(regex) || !label.trim().length}
              isLoading={addRegex.isLoading || editRegex.isLoading}
              onClick={() => {
                if (_regex) {
                  editRegex.mutate({
                    oldRegex: _regex,
                    newRegex: regex,
                    label,
                  });
                  return;
                }

                addRegex.mutate({
                  regex,
                  label,
                });
              }}
            >
              {_regex ? "Update" : "Create"}
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
