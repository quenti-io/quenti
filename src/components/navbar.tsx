import React from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import {
  IconChevronDown,
  IconLogout,
  IconMenu,
  IconMoon,
  IconSettings,
  IconSun,
  IconX,
  type TablerIconsProps,
} from "@tabler/icons-react";
import Link from "next/link";
import {
  Avatar,
  AvatarBadge,
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  useColorMode,
  useColorModeValue as mode,
  useColorModeValue,
  useDisclosure,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { Logo } from "../icons/logo";
import { useRouter } from "next/router";

export const Navbar: React.FC = () => {
  const router = useRouter();
  const onHomePage = router.pathname === "/";
  const { colorMode, toggleColorMode } = useColorMode();

  const { data: session, status } = useSession();
  const { isOpen: isMobileMenuOpen, onToggle: onMobileMenuToggle } =
    useDisclosure();

  const menuBg = useColorModeValue("white", "gray.800");
  const color = useColorModeValue("black", "white");

  return (
    <Flex pos="relative" zIndex={10} w="full">
      <HStack
        as="header"
        aria-label="Main navigation"
        maxW={onHomePage ? "7xl" : undefined}
        w="full"
        mx="auto"
        px={{ base: "6", md: "8" }}
        py="4"
        justify="space-between"
      >
        <HStack as="nav" spacing={4} height="12">
          <Flex
            align="center"
            justify="space-between"
            className="nav-content__mobile"
            color={mode("white", "white")}
          >
            <HStack as={Link} href="/" rel="home" ml="2">
              <Logo boxSize="35px" />
              <Heading
                as="p"
                fontSize="lg"
                color={useColorModeValue("black", "white")}
              >
                Quizlet.cc
              </Heading>
            </HStack>
          </Flex>
          <HStack display={["none", "none", "flex"]}>
            <Button
              as={Link}
              href="/home"
              variant="ghost"
              colorScheme="gray"
              fontWeight={700}
              fontSize="sm"
            >
              Home
            </Button>
            <Button
              as={Link}
              href="/create"
              fontWeight={700}
              fontSize="sm"
              rightIcon={<IconChevronDown />}
            >
              Create
            </Button>
          </HStack>
        </HStack>
        <Box display={["block", "block", "none"]}>
          <IconButton
            aria-label={"Open menu"}
            icon={
              isMobileMenuOpen ? <IconX size={20} /> : <IconMenu size={20} />
            }
            variant="ghost"
            colorScheme="gray"
            onClick={onMobileMenuToggle}
          />
          {/* <MobileMenu isOpen={isMobileMenuOpen} /> */}
        </Box>
        <HStack
          as="nav"
          spacing={4}
          display={["none", "none", "flex"]}
          height="12"
        >
          {session?.user && (
            <Menu placement="bottom-end">
              <MenuButton>
                <Wrap
                  spacing={3}
                  align="center"
                  overflow="visible"
                  color={color}
                >
                  <WrapItem>
                    <Avatar src={session.user.image!} size="sm">
                      <AvatarBadge boxSize="1em" bg="green.500" />
                    </Avatar>
                  </WrapItem>
                  <WrapItem>
                    <Text fontWeight={700}>{session.user.name}</Text>
                  </WrapItem>
                  <WrapItem>
                    <IconChevronDown />
                  </WrapItem>
                </Wrap>
              </MenuButton>
              <MenuList
                bg={menuBg}
                py={0}
                overflow="hidden"
                w="max"
                marginTop={2}
              >
                <MenuOption
                  icon={<IconSettings size={18} />}
                  label="Settings"
                  link="/settings"
                />
                {!onHomePage && (
                  <>
                    <MenuOption
                      icon={
                        colorMode == "dark" ? (
                          <IconSun size={18} />
                        ) : (
                          <IconMoon size={18} />
                        )
                      }
                      label={colorMode == "dark" ? "Light mode" : "Dark mode"}
                      onClick={toggleColorMode}
                    />
                    <MenuDivider />
                  </>
                )}
                <MenuOption
                  icon={<IconLogout size={18} />}
                  label="Sign out"
                  onClick={async () => {
                    await signOut();
                  }}
                />
              </MenuList>
            </Menu>
          )}
          {status !== "loading" && !session && (
            <Button
              colorScheme="blue"
              fontWeight={700}
              onClick={async () => {
                await signIn();
              }}
            >
              Sign in
            </Button>
          )}
        </HStack>
      </HStack>
    </Flex>
  );
};

interface MenuOptionProps {
  icon: React.ReactElement<TablerIconsProps, string>;
  label: string;
  link?: string;
  onClick?: () => void;
}

const MenuOption: React.FC<MenuOptionProps> = ({
  icon,
  label,
  link,
  onClick,
}) => {
  const bg = useColorModeValue("white", "gray.800");
  const hover = useColorModeValue("gray.100", "gray.700");
  const color = useColorModeValue("black", "white");

  return (
    <MenuItem
      icon={icon}
      as={link ? Link : undefined}
      href={link ?? ""}
      bg={bg}
      _hover={{ bg: hover }}
      onClick={onClick}
      py="2"
      fontWeight={600}
      color={color}
    >
      <Text>{label}</Text>
    </MenuItem>
  );
};
