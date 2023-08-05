import {
  Button,
  ButtonGroup,
  Flex,
  HStack,
  IconButton,
  ScaleFade,
  Text,
} from "@chakra-ui/react";
import {
  IconBan,
  IconSwitchHorizontal,
  IconUserX,
  IconX,
} from "@tabler/icons-react";

interface SelectedBarProps {
  selected: string[];
  onDeselectAll: () => void;
}

export const SelectedBar: React.FC<SelectedBarProps> = ({
  selected,
  onDeselectAll,
}) => {
  return (
    <ScaleFade in={selected.length > 0} unmountOnExit>
      <Flex justifyContent="space-between" px="6" alignItems="center">
        <HStack>
          <Text>
            <strong>{selected.length}</strong> selected
          </Text>
          <IconButton
            size="xs"
            icon={<IconX size={16} />}
            aria-label="Deselect all"
            colorScheme="gray"
            variant="ghost"
            onClick={onDeselectAll}
          />
        </HStack>
        <ButtonGroup size="sm" colorScheme="gray" variant="outline">
          <Button leftIcon={<IconSwitchHorizontal size={16} />}>
            Change section
          </Button>
          <Button leftIcon={<IconUserX size={16} />}>Remove</Button>
          <Button colorScheme="red" leftIcon={<IconBan size={16} />}>
            Ban
          </Button>
        </ButtonGroup>
      </Flex>
    </ScaleFade>
  );
};
