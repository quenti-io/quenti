import {
  Button,
  ButtonGroup,
  Checkbox,
  Flex,
  HStack,
  ScaleFade,
  Text,
} from "@chakra-ui/react";

import { IconBan, IconSwitchHorizontal, IconUserX } from "@tabler/icons-react";

interface SelectedBarProps {
  selected: string[];
  isAllSelected: boolean;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onChangeSectionSelected: () => void;
  onRemoveSelected: () => void;
}

export const SelectedBar: React.FC<SelectedBarProps> = ({
  selected,
  isAllSelected,
  onSelectAll,
  onDeselectAll,
  onChangeSectionSelected,
  onRemoveSelected,
}) => {
  return (
    <ScaleFade in={selected.length > 0} unmountOnExit>
      <Flex
        justifyContent="space-between"
        px="18px"
        alignItems="center"
        flexDir={{ base: "column", md: "row" }}
        gap="4"
      >
        <HStack spacing="3" w="full">
          <Checkbox
            isChecked={isAllSelected}
            onChange={isAllSelected ? onDeselectAll : onSelectAll}
          />
          <Text>
            <strong>{selected.length}</strong> selected
          </Text>
        </HStack>
        <ButtonGroup
          size="sm"
          colorScheme="gray"
          variant="outline"
          w={{ base: "full", md: "auto" }}
          spacing={{ base: 0, sm: 2 }}
          gap={{ base: 2, sm: 0 }}
          flexDir={{ base: "column", sm: "row" }}
        >
          <Button
            leftIcon={<IconSwitchHorizontal size={16} />}
            onClick={onChangeSectionSelected}
          >
            Change section
          </Button>
          <Button leftIcon={<IconUserX size={16} />} onClick={onRemoveSelected}>
            Remove
          </Button>
          <Button colorScheme="red" leftIcon={<IconBan size={16} />}>
            Ban
          </Button>
        </ButtonGroup>
      </Flex>
    </ScaleFade>
  );
};
