import { useSession } from "next-auth/react";
import NextLink from "next/link";
import React from "react";

import { Link } from "@quenti/components";

import {
  Button,
  Flex,
  HStack,
  Heading,
  Menu,
  MenuButton,
  MenuDivider,
  MenuList,
  useColorModeValue,
} from "@chakra-ui/react";

import {
  IconBooks,
  IconChevronDown,
  IconCloudDownload,
  IconFolder,
  IconSchool,
  IconSparkles,
} from "@tabler/icons-react";

import { Logo } from "../../../../../packages/components/logo";
import { useMe } from "../../hooks/use-me";
import { MenuOption } from "../menu-option";
import { TeacherOnly } from "../teacher-only";
import { UnboundOnly } from "../unbound-only";

export interface LeftNavProps {
  onFolderClick: () => void;
  onImportClick: () => void;
  onClassClick: () => void;
}

export const LeftNav: React.FC<LeftNavProps> = ({
  onFolderClick,
  onImportClick,
  onClassClick,
}) => {
  const session = useSession()!.data!;
  const { data: me } = useMe();

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
        <HStack as={Link} href="/home" rel="home" ml="2">
          <Logo boxSize="28px" />
          <Heading
            as="p"
            fontSize="2xl"
            color={useColorModeValue("black", "white")}
          >
            Quenti
          </Heading>
        </HStack>
      </Flex>
      {session?.user && me && (
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
          <TeacherOnly>
            <UnboundOnly strict>
              <Button
                as={Link}
                href={
                  me.orgMembership
                    ? `/orgs/${me.orgMembership.organization.id}`
                    : "/orgs"
                }
                variant="ghost"
                fontWeight={700}
                fontSize="sm"
                leftIcon={<IconSparkles size={18} />}
              >
                Upgrade
              </Button>
            </UnboundOnly>
          </TeacherOnly>
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
              shadow="lg"
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
              <TeacherOnly>
                <MenuOption
                  icon={<IconSchool size={20} />}
                  label="Class"
                  onClick={onClassClick}
                />
              </TeacherOnly>
            </MenuList>
          </Menu>
        </HStack>
      )}
    </HStack>
  );
};
