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
  MenuList,
  Text,
  useColorMode,
  useColorModeValue as mode,
  useColorModeValue,
  useDisclosure,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import {
  IconBooks,
  IconChevronDown,
  IconFolder,
  IconLogout,
  IconMenu,
  IconMoon,
  IconSettings,
  IconSun,
  IconUser,
  IconX,
} from "@tabler/icons-react";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { Logo } from "../icons/logo";
import { CreateFolderModal } from "./create-folder-modal";
import { MenuOption } from "./menu-option";

export const Navbar: React.FC = () => {
  const router = useRouter();
  const onHomePage = router.pathname === "/";
  const { colorMode, toggleColorMode } = useColorMode();

  const { data: session, status } = useSession();
  const { isOpen: isMobileMenuOpen, onToggle: onMobileMenuToggle } =
    useDisclosure();

  const [folderModalOpen, setFolderModalOpen] = React.useState(false);

  const menuBg = useColorModeValue("white", "gray.800");
  const color = useColorModeValue("black", "white");

  return (
    <>
      <CreateFolderModal
        isOpen={folderModalOpen}
        onClose={() => {
          setFolderModalOpen(false);
        }}
      />
      <Flex pos="relative" zIndex={100} w="full">
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
              <Menu placement="bottom-start">
                <MenuButton>
                  <Button
                    fontWeight={700}
                    fontSize="sm"
                    rightIcon={<IconChevronDown />}
                    as="div"
                  >
                    Create
                  </Button>
                </MenuButton>
                <MenuList
                  bg={menuBg}
                  py={0}
                  overflow="hidden"
                  w="max"
                  marginTop={2}
                >
                  <MenuOption
                    icon={<IconBooks size={20} />}
                    label="Study set"
                    link="/create"
                  />
                  <MenuOption
                    icon={<IconFolder size={20} />}
                    label="Folder"
                    onClick={() => {
                      setFolderModalOpen(true);
                    }}
                  />
                </MenuList>
              </Menu>
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
                      <Text fontWeight={700}>{session.user.username}</Text>
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
                    icon={<IconUser size={18} />}
                    label="Profile"
                    link={`/@${session.user.username}`}
                  />
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
                      await signOut({
                        callbackUrl: "/",
                      });
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
                  await signIn("google", {
                    callbackUrl: "/home",
                  });
                }}
              >
                Sign in
              </Button>
            )}
          </HStack>
        </HStack>
      </Flex>
    </>
  );
};
