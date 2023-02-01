import {
  Button,
  ButtonGroup,
  Flex,
  IconButton,
  Tooltip,
} from "@chakra-ui/react";
import type { StudySetVisibility } from "@prisma/client";
import {
  IconChevronDown,
  IconPlus,
  IconSwitchHorizontal,
  IconWorld,
} from "@tabler/icons-react";
import React from "react";
import { VisibilityModal } from "./visibility-modal";

export interface ButtonAreaProps {
  onImportOpen: () => void;
  onFlipTerms: () => void;
  visibility: StudySetVisibility;
  onVisibilityChange: (visibility: StudySetVisibility) => void;
}

export const ButtonArea: React.FC<ButtonAreaProps> = ({
  onImportOpen,
  onFlipTerms,
  visibility,
  onVisibilityChange,
}) => {
  const [VisibilityModalOpen, setVisibilityModalOpen] = React.useState(false);

  return (
    <>
      <VisibilityModal
        isOpen={VisibilityModalOpen}
        visibility={visibility}
        onChangeVisibility={(v) => {
          onVisibilityChange(v);
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
            leftIcon={<IconWorld />}
            rightIcon={<IconChevronDown />}
            variant="ghost"
            onClick={() => {
              setVisibilityModalOpen(true);
            }}
          >
            Public
          </Button>
          <Tooltip label="Flip terms and definitions">
            <IconButton
              icon={<IconSwitchHorizontal />}
              rounded="full"
              aria-label="Flip terms and definitions"
              onClick={onFlipTerms}
            />
          </Tooltip>
        </ButtonGroup>
      </Flex>
    </>
  );
};
