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
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";

import {
  IconCircleCheck,
  IconCircleDot,
  IconDotsVertical,
  IconEditCircle,
  IconFilterX,
} from "@tabler/icons-react";

import { MenuOption } from "../../components/menu-option";
import { OrganizationAdminOnly } from "./organization-admin-only";

export interface DomainFilterCardProps {
  filter: string;
  skeleton?: boolean;
  active: boolean;
  onRequestUpdate?: () => void;
  onRequestRemove?: () => void;
}

export const DomainFilterCard: React.FC<DomainFilterCardProps> = ({
  filter,
  skeleton = false,
  active,
  onRequestUpdate,
  onRequestRemove,
}) => {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const menuBg = useColorModeValue("white", "gray.800");
  const red = useColorModeValue("red.600", "red.200");

  return (
    <Skeleton rounded="md" w="full" h="50px" isLoaded={!skeleton}>
      <Card variant="outline" py="3" px="4">
        <HStack justifyContent="space-between">
          <HStack>
            <Text fontFamily="mono">{filter}</Text>p{" "}
            {active ? (
              <Box w="18px" h="18px" color="green.300">
                <Tooltip label="Active">
                  <IconCircleCheck size="18" />
                </Tooltip>
              </Box>
            ) : (
              <Box w="18px" h="18px" color="gray.500">
                <Tooltip label="Not yet active">
                  <IconCircleDot size="18" />
                </Tooltip>
              </Box>
            )}
          </HStack>
          <OrganizationAdminOnly>
            <Menu
              placement="bottom-end"
              isOpen={menuOpen}
              onOpen={() => setMenuOpen(true)}
              onClose={() => setMenuOpen(false)}
            >
              <MenuButton
                as={IconButton}
                size="xs"
                variant="ghost"
                colorScheme="gray"
              >
                <Box w="6" display="flex" justifyContent="center">
                  <IconDotsVertical size="18" />
                </Box>
              </MenuButton>
              <MenuList
                bg={menuBg}
                py={0}
                overflow="hidden"
                minW="auto"
                w="32"
                shadow="lg"
                display={menuOpen ? "block" : "none"}
              >
                <MenuOption
                  icon={<IconEditCircle size={16} />}
                  label="Update"
                  fontSize="sm"
                  py="6px"
                  onClick={onRequestUpdate}
                />
                <MenuOption
                  icon={<IconFilterX size={16} />}
                  label="Remove"
                  fontSize="sm"
                  py="6px"
                  onClick={onRequestRemove}
                  color={red}
                />
              </MenuList>
            </Menu>
          </OrganizationAdminOnly>
        </HStack>
      </Card>
    </Skeleton>
  );
};
