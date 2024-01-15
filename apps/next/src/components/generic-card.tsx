import React from "react";

import { Link } from "@quenti/components/link";
import { avatarUrl } from "@quenti/lib/avatar";

import {
  Avatar,
  Box,
  Card,
  Flex,
  HStack,
  Heading,
  IconButton,
  LinkBox,
  LinkOverlay,
  Menu,
  MenuButton,
  MenuList,
  Skeleton,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

import {
  IconDiscountCheck,
  IconDotsVertical,
  IconTrash,
} from "@tabler/icons-react";

import { plural } from "../utils/string";
import { MenuOption } from "./menu-option";

export interface GenericCardProps {
  title: string;
  numItems: number;
  itemsLabel: string;
  label?: React.ReactNode;
  bottom?: React.ReactNode;
  url: string;
  user: {
    username: string | null;
    image: string | null;
  };
  reverseTitle?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  verified?: boolean;
  removable?: boolean;
  onRemove?: () => void;
}

export const GenericCard = ({
  title,
  numItems,
  itemsLabel,
  label,
  bottom,
  url,
  user,
  reverseTitle = false,
  leftIcon,
  rightIcon,
  verified = false,
  removable = false,
  onRemove,
}: GenericCardProps) => {
  const termsTextColor = useColorModeValue("gray.600", "gray.400");
  const linkBg = useColorModeValue("white", "gray.800");
  const linkBorder = useColorModeValue("gray.200", "gray.700");
  const menuBg = useColorModeValue("white", "gray.800");

  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <LinkBox
      as="article"
      h="full"
      rounded="lg"
      p="5"
      bg={linkBg}
      borderColor={linkBorder}
      borderWidth="2px"
      shadow="lg"
      transition="all ease-in-out 150ms"
      zIndex={menuOpen ? 30 : 25}
      _hover={{
        transform: "translateY(-2px)",
        borderBottomColor: "blue.300",
      }}
      sx={{
        "&:has(:focus-visible)": {
          transform: "translateY(-2px)",
          borderColor: "blue.300",
        },
      }}
    >
      <Flex justifyContent="space-between" flexDir="column" h="full" gap={4}>
        <Stack
          spacing={2}
          direction={reverseTitle ? "column-reverse" : "column"}
        >
          <Heading
            size="md"
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              lineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            <LinkOverlay
              as={Link}
              href={url}
              _focus={{
                outline: "none",
              }}
            >
              {title}
            </LinkOverlay>
          </Heading>
          {!label ? (
            <HStack spacing="2" color={termsTextColor}>
              {leftIcon}
              <Text fontSize="sm">{plural(numItems, itemsLabel)}</Text>
              {rightIcon}
            </HStack>
          ) : (
            <HStack spacing="2" color={termsTextColor}>
              {label}
            </HStack>
          )}
        </Stack>
        <Flex justifyContent="space-between">
          <HStack spacing={2}>
            {!bottom ? (
              <>
                <Avatar
                  src={avatarUrl(user)}
                  size="xs"
                  className="highlight-block"
                  pointerEvents="none"
                />
                <HStack spacing={1}>
                  <Text
                    fontSize="sm"
                    fontWeight={600}
                    className="highlight-block"
                    w="max-content"
                  >
                    {user.username}
                  </Text>
                  {verified && (
                    <Box>
                      <IconDiscountCheck aria-label="Verified" size={18} />
                    </Box>
                  )}
                </HStack>
              </>
            ) : (
              bottom
            )}
          </HStack>
          {removable && (
            <Box zIndex="20" position="relative">
              <Menu
                placement="bottom-end"
                isOpen={menuOpen}
                onOpen={() => setMenuOpen(true)}
                onClose={() => setMenuOpen(false)}
              >
                <MenuButton
                  rounded="md"
                  as={IconButton}
                  icon={<IconDotsVertical size="20" />}
                  aria-label="options"
                  size="sm"
                  variant="ghost"
                  colorScheme="gray"
                  _hover={{
                    bg: "none",
                  }}
                  _active={{
                    bg: "none",
                  }}
                />
                <MenuList
                  bg={menuBg}
                  py={0}
                  overflow="hidden"
                  display={menuOpen ? "block" : "none"}
                  minW="124px"
                >
                  <MenuOption
                    icon={<IconTrash size={20} />}
                    label="Remove"
                    onClick={onRemove}
                  />
                </MenuList>
              </Menu>
            </Box>
          )}
        </Flex>
      </Flex>
    </LinkBox>
  );
};

GenericCard.Skeleton = function GenericCardSkeleton() {
  return (
    <Card
      rounded="lg"
      height="full"
      borderWidth="2px"
      borderColor="gray.200"
      _dark={{
        bg: "gray.800",
        borderColor: "gray.700",
      }}
      shadow="lg"
      p="5"
    >
      <Flex justifyContent="space-between" flexDir="column" h="full" gap={4}>
        <Stack spacing={2}>
          <Skeleton rounded="lg" fitContent variant="refined">
            <Heading size="md">Set Placeholder Title</Heading>
          </Skeleton>
          <Flex alignItems="center" h="21px">
            <Skeleton rounded="4px" fitContent h="14px" variant="refined">
              <Text fontSize="sm">100 terms</Text>
            </Skeleton>
          </Flex>
        </Stack>
        <HStack>
          <Skeleton rounded="full" w="24px" h="24px" variant="refined" />
          <Flex alignItems="center" h="21px">
            <Skeleton rounded="4px" fitContent h="14px" variant="refined">
              <Text fontSize="sm" fontWeight={600}>
                placeholder
              </Text>
            </Skeleton>
          </Flex>
        </HStack>
      </Flex>
    </Card>
  );
};
