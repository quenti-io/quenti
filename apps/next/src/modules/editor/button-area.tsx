import React from "react";

import {
  Button,
  ButtonGroup,
  Flex,
  IconButton,
  Menu,
  Skeleton,
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

export const ButtonArea = ({ onImportOpen }: ButtonAreaProps) => {
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
          leftIcon={<IconPlus size={18} />}
          variant="outline"
          onClick={onImportOpen}
          colorScheme="gray"
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
                  aria-label="Show keyboard shortcuts"
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

ButtonArea.Skeleton = function ButtonAreaSkeleton() {
  return (
    <Flex align={"center"} justifyContent={"space-between"}>
      <Skeleton fitContent rounded="lg">
        <Button leftIcon={<IconPlus />} variant="outline">
          Import terms
        </Button>
      </Skeleton>
      <ButtonGroup>
        <ButtonGroup spacing={4}>
          <Skeleton rounded="full">
            <IconButton
              icon={<IconSwitchHorizontal />}
              rounded="full"
              aria-label="Flip terms and definitions"
            />
          </Skeleton>
          <Skeleton rounded="full">
            <IconButton
              icon={<IconKeyboard />}
              rounded="full"
              aria-label="Show keyboard shortcuts"
            />
          </Skeleton>
        </ButtonGroup>
      </ButtonGroup>
    </Flex>
  );
};
