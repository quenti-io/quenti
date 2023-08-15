import React from "react";

import type {
  MembershipRole,
  OrganizationDomainType,
} from "@quenti/prisma/client";

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
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";

import {
  IconCircleCheck,
  IconCircleDot,
  IconDiscountCheck,
  IconDotsVertical,
  IconEditCircle,
  IconWorldX,
} from "@tabler/icons-react";

import { MenuOption } from "../../components/menu-option";
import { useOrganization } from "../../hooks/use-organization";
import { briefFormatter } from "../../utils/time";
import { DomainConflictCard } from "./domain-conflict-card";
import { OrganizationAdminOnly } from "./organization-admin-only";

interface DomainCardProps {
  role: MembershipRole;
  domain: string | null;
  requestedDomain: string;
  verifiedAt: Date | null;
  type: OrganizationDomainType;
  conflicting?: boolean;
  onRequestVerify?: () => void;
  onRequestUpdate?: () => void;
  onRequestRemove?: () => void;
}

export const DomainCard: React.FC<DomainCardProps> = (props) => {
  const { data: org } = useOrganization();

  return (
    <Stack spacing="3">
      <Skeleton rounded="md" w="full" isLoaded={!!org}>
        <Card variant="outline" py="3" px="4">
          <InnerDomainCard {...props} />
        </Card>
      </Skeleton>
      {props.conflicting && (
        <DomainConflictCard domain={props.requestedDomain} />
      )}
    </Stack>
  );
};

const InnerDomainCard: React.FC<DomainCardProps> = ({
  domain,
  requestedDomain,
  verifiedAt,
  type,
  onRequestVerify,
  onRequestUpdate,
  onRequestRemove,
}) => {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const menuBg = useColorModeValue("white", "gray.800");

  const verified = !!verifiedAt;
  const verifiedDomain = domain == requestedDomain;

  const red = useColorModeValue("red.600", "red.200");

  return (
    <Flex
      justifyContent="space-between"
      flexDir={{ base: "column", md: "row" }}
    >
      <HStack>
        <Text>{requestedDomain}</Text>
        {!verified ? (
          <Tag
            size="sm"
            colorScheme="orange"
            cursor="pointer"
            onClick={onRequestVerify}
          >
            Unverified
          </Tag>
        ) : verifiedDomain ? (
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
        {type == "Student" && (
          <Tag colorScheme="green" size="sm">
            Student
          </Tag>
        )}
      </HStack>
      <HStack>
        {verified && (
          <Text color="gray.500" fontSize="sm">
            Added on {briefFormatter.format(verifiedAt)}
          </Text>
        )}
        {type !== "Base" && (
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
                <MenuOption
                  icon={<IconWorldX size={16} />}
                  label="Remove"
                  fontSize="sm"
                  py="6px"
                  onClick={onRequestRemove}
                  color={red}
                />
              </MenuList>
            </Menu>
          </OrganizationAdminOnly>
        )}
      </HStack>
    </Flex>
  );
};
