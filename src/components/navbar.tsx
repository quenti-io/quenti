import React from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { IconMenu, IconMoon, IconSun, IconUser, IconX } from "@tabler/icons-react";
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
  const { isOpen, onToggle } = useDisclosure();
  const { isOpen: isMobileMenuOpen, onToggle: onMobileMenuToggle } =
    useDisclosure();

  return (
    <Flex pos="relative" zIndex={10} w="full">
      <HStack
        as="header"
        aria-label="Main navigation"
        maxW="7xl"
        w="full"
        mx="auto"
        px={{ base: "6", md: "8" }}
        py="4"
        justify="space-between"
      >
        <Flex
          align="center"
          justify="space-between"
          className="nav-content__mobile"
          color={mode("white", "white")}
        >
          <HStack as={Link} href="/" rel="home" ml="2">
            <Logo boxSize="35px" />
            <Heading as="p" fontSize="lg" color={useColorModeValue("black", "white")}>
              Quizlet.cc
            </Heading>
          </HStack>
        </Flex>
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
            <Wrap spacing={3} align="center" overflow="visible">
              <WrapItem>
                <Avatar src={session.user.image!} size="sm">
                  <AvatarBadge boxSize="1em" bg="green.500" />
                </Avatar>
              </WrapItem>
              <WrapItem>
                <Text fontWeight={700}>{session.user.name}</Text>
              </WrapItem>
            </Wrap>
          )}
          {status !== "loading" && (
            <Button
              colorScheme="blue"
              variant={session ? "outline" : "solid"}
              fontWeight={700}
              onClick={() => {
                if (session) signOut();
                else signIn();
              }}
            >
              Sign {session ? "out" : "in"}
            </Button>
          )}
          {session?.user && onHomePage && (
            <Button
              colorScheme="orange"
              fontWeight={700}
              as={Link}
              href="/sets"
            >
              View my sets
            </Button>
          )}
          <IconButton
            icon={<IconMoon />}
            aria-label="Theme"
            rounded="full"
            variant="ghost"
            onClick={() => {
              toggleColorMode();
            }}
          />
        </HStack>
      </HStack>
    </Flex>
  );
};
