import {
  Button,
  ButtonGroup,
  Flex,
  IconButton,
  Tooltip,
} from "@chakra-ui/react";
import { IconPlus, IconSwitchHorizontal } from "@tabler/icons-react";

export interface ButtonAreaProps {
  onImportOpen: () => void;
  onFlipTerms: () => void;
}

export const ButtonArea: React.FC<ButtonAreaProps> = ({
  onImportOpen,
  onFlipTerms,
}) => {
  return (
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
  );
};
