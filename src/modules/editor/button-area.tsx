import {
  Button,
  ButtonGroup,
  Flex,
  IconButton,
  Tooltip,
} from "@chakra-ui/react";
import {
  IconChevronDown,
  IconPlus,
  IconSwitchHorizontal,
} from "@tabler/icons-react";
import React from "react";
import { visibilityIcon } from "../../common/visibility-icon";
import { useSetEditorContext } from "../../stores/use-set-editor-store";
import { VisibilityModal } from "./visibility-modal";

export interface ButtonAreaProps {
  onImportOpen: () => void;
}

export const ButtonArea: React.FC<ButtonAreaProps> = ({ onImportOpen }) => {
  const visibility = useSetEditorContext((s) => s.visibility);
  const setVisibility = useSetEditorContext((s) => s.setVisibility);
  const flipTerms = useSetEditorContext((s) => s.flipTerms);

  const [visibilityModalOpen, setVisibilityModalOpen] = React.useState(false);

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
          <Tooltip label="Flip terms and definitions">
            <IconButton
              icon={<IconSwitchHorizontal />}
              rounded="full"
              aria-label="Flip terms and definitions"
              onClick={flipTerms}
            />
          </Tooltip>
        </ButtonGroup>
      </Flex>
    </>
  );
};
