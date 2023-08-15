import React from "react";

import {
  Button,
  ButtonGroup,
  Flex,
  IconButton,
  Menu,
  Tooltip,
} from "@chakra-ui/react";

import {
  IconChevronDown,
  IconKeyboard,
  IconPlus,
  IconSwitchHorizontal,
} from "@tabler/icons-react";

import { visibilityIcon } from "../../common/visibility-icon";
import { useSetEditorContext } from "../../stores/use-set-editor-store";
import { ShortcutModal } from "./shortcut-modal";
import { VisibilityModal } from "./visibility-modal";

export interface ButtonAreaProps {
  onImportOpen: () => void;
}

export const ButtonArea: React.FC<ButtonAreaProps> = ({ onImportOpen }) => {
  const visibility = useSetEditorContext((s) => s.visibility);
  const setVisibility = useSetEditorContext((s) => s.setVisibility);
  const flipTerms = useSetEditorContext((s) => s.flipTerms);

  const [visibilityModalOpen, setVisibilityModalOpen] = React.useState(false);
  const [shortcutModalOpen, setShortcutModalOpen] = React.useState(false);

  return (
    <>
      <VisibilityModal
        isOpen={visibilityModalOpen}
        visibility={visibility}
        onChangeVisibility={(v) => {
          setVisibility(v);
          setVisibilityModalOpen(false);
        }}
        onClose={() => {
          setVisibilityModalOpen(false);
        }}
      />
      <ShortcutModal
        isOpen={shortcutModalOpen}
        onClose={() => setShortcutModalOpen(false)}
      />
      <Flex align={"center"} justifyContent={"space-between"}>
        <Button
          leftIcon={<IconPlus />}
          variant="ghost"
          colorScheme="orange"
          onClick={onImportOpen}
        >
          Import terms
        </Button>
        <ButtonGroup>
          <Button
            leftIcon={visibilityIcon(visibility)}
            rightIcon={<IconChevronDown />}
            variant="ghost"
            onClick={() => {
              setVisibilityModalOpen(true);
            }}
          >
            {visibility}
          </Button>
          <ButtonGroup spacing={4}>
            <Tooltip label="Flip terms and definitions">
              <IconButton
                icon={<IconSwitchHorizontal />}
                rounded="full"
                aria-label="Flip terms and definitions"
                onClick={flipTerms}
              />
            </Tooltip>
            <Menu placement="bottom-end">
              <Tooltip label="Show keyboard shortcuts">
                <IconButton
                  icon={<IconKeyboard />}
                  rounded="full"
                  aria-label="Flip terms and definitions"
                  onClick={() => setShortcutModalOpen(true)}
                />
              </Tooltip>
            </Menu>
          </ButtonGroup>
        </ButtonGroup>
      </Flex>
    </>
  );
};
