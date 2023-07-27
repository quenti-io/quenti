import {
  Box,
  Card,
  Flex,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  Skeleton,
  Stack,
  Tag,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  IconDiscountCheck,
  IconDotsVertical,
  IconEditCircle,
} from "@tabler/icons-react";
import React from "react";
import { MenuOption } from "../../components/menu-option";
import { SkeletonLabel } from "../../components/skeleton-label";
import { useOrganization } from "../../hooks/use-organization";
import { briefFormatter } from "../../utils/time";
import { OrganizationAdminOnly } from "./organization-admin-only";

interface DomainCardProps {
  onRequestVerify: () => void;
  onRequestUpdate: () => void;
}

export const DomainCard: React.FC<DomainCardProps> = ({
  onRequestVerify,
  onRequestUpdate,
}) => {
  const org = useOrganization();

  const [menuOpen, setMenuOpen] = React.useState(false);

  const menuBg = useColorModeValue("white", "gray.800");

  const verified = !!org?.domain?.verifiedAt;

  return (
    <Stack spacing="1">
      <SkeletonLabel isLoaded={!!org}>Domain</SkeletonLabel>
      <Skeleton rounded="md" w="full" isLoaded={!!org}>
        <Card variant="outline" py="3" px="4">
          <Flex justifyContent="space-between">
            <HStack>
              <Text>{org?.domain?.requestedDomain || "Loading..."}</Text>
              {!verified && (
                <Tag
                  size="sm"
                  colorScheme="orange"
                  cursor="pointer"
                  onClick={onRequestVerify}
                >
                  Unverified
                </Tag>
              )}
            </HStack>
            <HStack>
              {verified && (
                <Text color="gray.500" fontSize="sm">
                  Added on {briefFormatter.format(org.domain!.verifiedAt!)}
                </Text>
              )}
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
                    {!verified && (
                      <MenuOption
                        icon={<IconDiscountCheck size={16} />}
                        label="Verify"
                        fontSize="sm"
                        py="6px"
                        onClick={onRequestVerify}
                      />
                    )}
                    <MenuOption
                      icon={<IconEditCircle size={16} />}
                      label="Update"
                      fontSize="sm"
                      py="6px"
                      onClick={onRequestUpdate}
                    />
                  </MenuList>
                </Menu>
              </OrganizationAdminOnly>
            </HStack>
          </Flex>
        </Card>
      </Skeleton>
    </Stack>
  );
};
