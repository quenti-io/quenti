import { useSession } from "next-auth/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React from "react";

import { Link } from "@quenti/components";
import { WEBSITE_URL } from "@quenti/lib/constants/url";

import {
  Box,
  Button,
  Menu,
  MenuButton,
  MenuDivider,
  MenuList,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";

import {
  IconBooks,
  IconChevronDown,
  IconCloudDownload,
  IconFolder,
  IconSchool,
} from "@tabler/icons-react";

import { MenuOption } from "../menu-option";
import { TeacherOnly } from "../teacher-only";
import { MobileUserOptions } from "./mobile-user-options";

export interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onFolderClick: () => void;
  onClassClick: () => void;
  onImportClick: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  onFolderClick,
  onClassClick,
  onImportClick,
}) => {
  const router = useRouter();
  React.useEffect(() => {
    if (isOpen) onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.pathname]);

  const { data: session, status } = useSession()!;
  const menuBg = useColorModeValue("white", "gray.800");

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <>
      <Box
        position="absolute"
        top="80px"
        left="0"
        w="full"
        h="calc(100vh - 80px)"
        pointerEvents={isOpen ? "auto" : "none"}
        className="backdrop-blur-sm"
        bg="rgba(247, 250, 252, 0.75)"
        _dark={{
          bg: "rgba(23, 25, 35, 0.75)",
        }}
        opacity={isOpen ? 1 : 0}
        transition="opacity ease-in-out 200ms"
        onClick={() => {
          onClose();
        }}
      />
      <Stack
        pos="absolute"
        insetX={0}
        opacity={isOpen ? 1 : 0}
        transition="opacity ease-in-out 200ms"
        pointerEvents={isOpen ? "auto" : "none"}
        className="backdrop-blur-2xl"
        px="6"
        py="6"
        pt="10"
        spacing={8}
      >
        <Stack spacing={4}>
          {session?.user && (
            <Button
              variant="outline"
              colorScheme="gray"
              fontWeight={700}
              fontSize="sm"
              onClick={async () => {
                onClose();
                await router.push("/home");
              }}
            >
              Home
            </Button>
          )}
          {session?.user && (
            <Menu
              boundary="scrollParent"
              placement="bottom"
              isOpen={menuOpen}
              onOpen={() => setMenuOpen(true)}
              onClose={() => setMenuOpen(false)}
            >
              <MenuButton>
                <Button
                  w="full"
                  fontWeight={700}
                  fontSize="sm"
                  rightIcon={
                    <IconChevronDown
                      style={{
                        transition: "rotate ease-in-out 200ms",
                        rotate: menuOpen ? "180deg" : "0deg",
                      }}
                    />
                  }
                  as="div"
                >
                  Create
                </Button>
              </MenuButton>
              <MenuList
                bg={menuBg}
                py={0}
                overflow="hidden"
                w="calc(100vw - 48px)"
              >
                <NextLink href="/create" passHref>
                  <MenuOption
                    icon={<IconBooks size={20} />}
                    label="Study set"
                    onClick={() => {
                      onClose();
                    }}
                  />
                </NextLink>
                <MenuOption
                  icon={<IconCloudDownload size={20} />}
                  label="Import from Quizlet"
                  onClick={onImportClick}
                />
                <MenuDivider />
                <MenuOption
                  icon={<IconFolder size={20} />}
                  label="Folder"
                  onClick={onFolderClick}
                />
                <TeacherOnly>
                  <MenuOption
                    icon={<IconSchool size={20} />}
                    label="Class"
                    onClick={onClassClick}
                  />
                </TeacherOnly>
              </MenuList>
            </Menu>
          )}
          {status !== "loading" && !session && (
            <>
              <Button
                variant="ghost"
                colorScheme="gray"
                as={Link}
                href={`${WEBSITE_URL}/features`}
              >
                Features
              </Button>
              <Button
                variant="ghost"
                colorScheme="gray"
                as={Link}
                href={`${WEBSITE_URL}/features`}
              >
                Solutions
              </Button>
              <Button
                variant="ghost"
                colorScheme="gray"
                as={Link}
                href={`${WEBSITE_URL}/pricing`}
              >
                Pricing
              </Button>
              <Button
                mt="4"
                colorScheme="gray"
                variant="outline"
                as={Link}
                href="/auth/login"
              >
                Log in
              </Button>{" "}
              <Button as={Link} href="/auth/signup">
                Sign up for free
              </Button>
            </>
          )}
        </Stack>
        {session?.user && <MobileUserOptions closeMenu={onClose} />}
      </Stack>
    </>
  );
};

export default MobileMenu;
