import {
  Button,
  Flex,
  Heading,
  HStack,
  Menu,
  MenuButton,
  MenuDivider,
  MenuList,
  useColorModeValue
} from "@chakra-ui/react";
import {
  IconBooks,
  IconChevronDown,
  IconCloudDownload,
  IconFolder
} from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import NextLink from "next/link";
import React from "react";
import { Logo } from "../../icons/logo";
import { Link } from "../link";
import { MenuOption } from "../menu-option";

export interface LeftNavProps {
  onFolderClick: () => void;
  onImportClick: () => void;
}

export const LeftNav: React.FC<LeftNavProps> = ({
  onFolderClick,
  onImportClick,
}) => {
  const session = useSession()!.data!;

  const [menuOpen, setMenuOpen] = React.useState(false);

  const menuBg = useColorModeValue("white", "gray.800");

  return (
    <HStack as="nav" spacing={4} height="12">
      <Flex
        align="center"
        justify="space-between"
        className="nav-content__mobile"
        color="white"
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
      {session?.user && (
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
          {session?.user?.admin && (
            <Button
              as={Link}
              href="/admin"
              variant="ghost"
              colorScheme="gray"
              fontWeight={700}
              fontSize="sm"
            >
              Admin
            </Button>
          )}
          <Menu
            placement="bottom-start"
            isOpen={menuOpen}
            onOpen={() => setMenuOpen(true)}
            onClose={() => setMenuOpen(false)}
          >
            <MenuButton>
              <Button
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
              w="max"
              marginTop={2}
            >
              <NextLink href="/create" passHref>
                <MenuOption icon={<IconBooks size={20} />} label="Study set" />
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
            </MenuList>
          </Menu>
        </HStack>
      )}
    </HStack>
  );
};
