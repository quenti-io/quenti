import React from "react";

import {
  Box,
  Card,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  Skeleton,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

import {
  IconDotsVertical,
  IconEditCircle,
  IconTrashX,
  IconUsersPlus,
} from "@tabler/icons-react";

import { MenuOption } from "../../components/menu-option";
import { plural } from "../../utils/string";

export interface SectionCardProps {
  name: string;
  students: number;
  skeleton?: boolean;
  onRequestEdit?: () => void;
  onRequestDelete?: () => void;
  onRequestJoinCode?: () => void;
}

export const SectionCard: React.FC<SectionCardProps> = ({
  name,
  students,
  skeleton,
  onRequestEdit,
  onRequestDelete,
  onRequestJoinCode,
}) => {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const menuBg = useColorModeValue("white", "gray.800");
  const red = useColorModeValue("red.600", "red.200");

  return (
    <Skeleton rounded="md" w="full" isLoaded={!skeleton}>
      <Card variant="outline" py="3" px="4">
        <HStack justifyContent="space-between">
          <HStack>
            <Text fontWeight={600}>{name}</Text>
            <Text fontSize="sm" color="gray.500">
              {plural(students, "student")}
            </Text>
          </HStack>
          <HStack spacing="1">
            <IconButton
              size="xs"
              icon={<IconUsersPlus size={18} />}
              aria-label="Add students"
              variant="ghost"
              colorScheme="gray"
              onClick={onRequestJoinCode}
            />
            <Menu
              isOpen={menuOpen}
              onClose={() => setMenuOpen(false)}
              onOpen={() => setMenuOpen(true)}
              placement="bottom-end"
            >
              <MenuButton>
                <Box w="6" display="flex" justifyContent="center">
                  <IconDotsVertical size="18" />
                </Box>
              </MenuButton>
              <MenuList
                bg={menuBg}
                py={0}
                overflow="hidden"
                minW="auto"
                shadow="lg"
                w="32"
                display={menuOpen ? "block" : "none"}
              >
                <MenuOption
                  icon={<IconEditCircle size={16} />}
                  label="Edit"
                  fontSize="sm"
                  py="6px"
                  onClick={onRequestEdit}
                />
                <MenuOption
                  icon={<IconTrashX size={16} />}
                  label="Delete"
                  fontSize="sm"
                  py="6px"
                  color={red}
                  onClick={onRequestDelete}
                />
              </MenuList>
            </Menu>
          </HStack>
        </HStack>
      </Card>
    </Skeleton>
  );
};
