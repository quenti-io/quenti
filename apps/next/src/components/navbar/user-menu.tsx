import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";

import { avatarUrl } from "@quenti/lib/avatar";

import {
  Avatar,
  AvatarBadge,
  Menu,
  MenuButton,
  MenuDivider,
  MenuList,
  Text,
  Wrap,
  WrapItem,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";

import {
  IconBuildingSkyscraper,
  IconChevronDown,
  IconLogout,
  IconMoon,
  IconSettings,
  IconSun,
  IconUser,
} from "@tabler/icons-react";

import { useMe } from "../../hooks/use-me";
import { MenuOption } from "../menu-option";
import { TeacherOnly } from "../teacher-only";

export const UserMenu = () => {
  const session = useSession()!.data!;
  const user = session.user!;
  const { data: me } = useMe();

  const menuBg = useColorModeValue("white", "gray.800");
  const color = useColorModeValue("black", "white");

  const { colorMode, toggleColorMode } = useColorMode();
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <Menu
      placement="bottom-end"
      isOpen={menuOpen}
      onOpen={() => setMenuOpen(true)}
      onClose={() => setMenuOpen(false)}
    >
      <MenuButton>
        <Wrap spacing={3} align="center" overflow="visible" color={color}>
          <WrapItem>
            <Avatar
              src={avatarUrl({
                ...user,
                image: user.image!,
              })}
              size="sm"
              className="highlight-block"
            >
              <AvatarBadge boxSize="1em" bg="green.500" />
            </Avatar>
          </WrapItem>
          <WrapItem>
            <Text fontWeight={700} className="highlight-block">
              {user.username}
            </Text>
          </WrapItem>
          <WrapItem>
            <IconChevronDown
              style={{
                transition: "rotate ease-in-out 200ms",
                rotate: menuOpen ? "180deg" : "0deg",
              }}
            />
          </WrapItem>
        </Wrap>
      </MenuButton>
      <MenuList
        bg={menuBg}
        py={0}
        overflow="hidden"
        w="max"
        marginTop={2}
        shadow="lg"
      >
        <Link href={`/@${user.username}`} passHref>
          <MenuOption icon={<IconUser size={18} />} label="Profile" />
        </Link>
        <Link href="/settings" passHref>
          <MenuOption icon={<IconSettings size={18} />} label="Settings" />
        </Link>
        {me?.orgMembership && (
          <TeacherOnly>
            <MenuDivider />
            <Link href={`/orgs/${me.orgMembership.organization.id}`} passHref>
              <MenuOption
                icon={<IconBuildingSkyscraper size={18} />}
                label={me.orgMembership.organization.name}
              />
            </Link>
          </TeacherOnly>
        )}
        <MenuDivider />
        <MenuOption
          icon={
            colorMode == "dark" ? <IconSun size={18} /> : <IconMoon size={18} />
          }
          label={colorMode == "dark" ? "Light mode" : "Dark mode"}
          onClick={toggleColorMode}
        />
        <MenuOption
          icon={<IconLogout size={18} />}
          label="Sign out"
          onClick={async () => {
            await signOut({
              callbackUrl: "/auth/login",
            });
          }}
        />
      </MenuList>
    </Menu>
  );
};

export default UserMenu;
