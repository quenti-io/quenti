import {
  Avatar,
  Box,
  ButtonGroup,
  Flex,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  Skeleton,
  SkeletonText,
  Stack,
  Tag,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import type { MembershipRole, User } from "@quenti/prisma/client";
import {
  IconDotsVertical,
  IconEdit,
  IconExternalLink,
  IconUserX,
} from "@tabler/icons-react";
import React from "react";
import { Link } from "../../components/link";
import { MenuOption } from "../../components/menu-option";
import { useOrganization } from "../../hooks/use-organization";
import { avatarUrl } from "../../utils/avatar";
import { OrganizationAdminOnly } from "./organization-admin-only";

export interface OrganizationMemberProps {
  user: Pick<User, "id" | "name" | "username" | "email" | "image">;
  role: MembershipRole;
  accepted?: boolean;
  isCurrent?: boolean;
  skeleton?: boolean;
  isEmpty?: boolean;
  onRequestEdit?: () => void;
  onRequestRemove?: () => void;
}

export const OrganizationMember: React.FC<OrganizationMemberProps> = ({
  user,
  role,
  isCurrent = false,
  accepted = true,
  skeleton = false,
  isEmpty = false,
  onRequestEdit,
  onRequestRemove,
}) => {
  const org = useOrganization();
  const myRole: MembershipRole = org?.me?.role || "Member";

  const [menuOpen, setMenuOpen] = React.useState(false);

  const canManageMember =
    user.id !== org?.me?.userId &&
    myRole !== "Member" &&
    (role !== "Owner" || myRole === "Owner");

  const borderColor = useColorModeValue("gray.100", "gray.750");
  const bg = useColorModeValue("white", "gray.800");
  const buttonGroupBg = useColorModeValue("gray.50", "gray.800");
  const menuBg = useColorModeValue("white", "gray.800");
  const redMenuColor = useColorModeValue("red.600", "red.200");

  return (
    <Box
      px="4"
      py="3"
      border="2px"
      bg={bg}
      borderColor={borderColor}
      rounded="lg"
      transition="border-color 0.2s ease-in-out"
      _hover={
        !skeleton
          ? {
              borderLeftColor: "blue.300",
            }
          : {}
      }
    >
      <Flex alignItems="center" justifyContent="space-between">
        <HStack spacing="4">
          <Skeleton isLoaded={!skeleton} fitContent rounded="full" h="32px">
            <Avatar
              size="sm"
              src={!skeleton ? avatarUrl({ ...user, image: user.image! }) : ""}
            />
          </Skeleton>
          <Stack spacing="0">
            <Flex alignItems="center" h="6">
              <SkeletonText
                isLoaded={!skeleton}
                fitContent
                noOfLines={1}
                skeletonHeight="5"
              >
                <HStack>
                  <Text fontWeight={700} fontFamily="Outfit">
                    {user.name}
                  </Text>
                  {!accepted && (
                    <Tag size="sm" colorScheme="orange">
                      Pending
                    </Tag>
                  )}
                  {isCurrent && (
                    <Tag size="sm" colorScheme="blue">
                      You
                    </Tag>
                  )}
                  {accepted && role !== "Member" && (
                    <Tag
                      size="sm"
                      colorScheme={role == "Owner" ? "purple" : "gray"}
                    >
                      {role}
                    </Tag>
                  )}
                </HStack>
              </SkeletonText>
            </Flex>
            <Flex alignItems="center" h="21px">
              <SkeletonText
                isLoaded={!skeleton}
                noOfLines={1}
                fitContent
                skeletonHeight="3"
              >
                <Text fontSize="sm" color="gray.500">
                  {user.email}
                </Text>
              </SkeletonText>
            </Flex>
          </Stack>
        </HStack>
        <ButtonGroup
          size="sm"
          alignItems="center"
          isAttached
          variant="outline"
          colorScheme="gray"
          bg={buttonGroupBg}
          rounded="md"
        >
          <Skeleton fitContent rounded="md" isLoaded={!skeleton}>
            {!isEmpty && (
              <IconButton
                aria-label="View public profile"
                icon={<IconExternalLink size={18} />}
                as={Link}
                roundedRight={canManageMember ? "none" : "md"}
                href={`/@${user.username}`}
              />
            )}
          </Skeleton>
          <OrganizationAdminOnly>
            {canManageMember && (
              <Box position="relative">
                <Menu
                  placement="bottom-end"
                  isOpen={menuOpen}
                  onOpen={() => setMenuOpen(true)}
                  onClose={() => setMenuOpen(false)}
                >
                  <MenuButton
                    roundedLeft={!isEmpty ? "none" : undefined}
                    as={IconButton}
                    w="8"
                    h="8"
                  >
                    <Box w="8" display="flex" justifyContent="center">
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
                      icon={<IconEdit size={16} />}
                      label="Edit"
                      fontSize="sm"
                      py="6px"
                      onClick={onRequestEdit}
                    />
                    <MenuOption
                      icon={<IconUserX size={16} />}
                      label="Remove"
                      fontSize="sm"
                      py="6px"
                      color={redMenuColor}
                      onClick={onRequestRemove}
                    />
                  </MenuList>
                </Menu>
              </Box>
            )}
          </OrganizationAdminOnly>
        </ButtonGroup>
      </Flex>
    </Box>
  );
};
