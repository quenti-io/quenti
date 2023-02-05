import {
  Avatar,
  AvatarBadge,
  Menu,
  MenuButton,
  MenuDivider,
  MenuList,
  Text,
  useColorMode,
  useColorModeValue,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import {
  IconChevronDown,
  IconLogout,
  IconMoon,
  IconSettings,
  IconSun,
  IconUser,
} from "@tabler/icons-react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import { avatarUrl } from "../../utils/avatar";
import { MenuOption } from "../menu-option";

export const UserMenu = () => {
  const router = useRouter();
  const onStaticPage = router.pathname === "/" || router.pathname === "/404";

  const session = useSession()!.data!;
  const user = session.user!;

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
            >
              <AvatarBadge boxSize="1em" bg="green.500" />
            </Avatar>
          </WrapItem>
          <WrapItem>
            <Text fontWeight={700}>{user.username}</Text>
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
      <MenuList bg={menuBg} py={0} overflow="hidden" w="max" marginTop={2}>
        <MenuOption
          icon={<IconUser size={18} />}
          label="Profile"
          link={`/@${user.username}`}
        />
        <MenuOption
          icon={<IconSettings size={18} />}
          label="Settings"
          link="/settings"
        />
        {!onStaticPage && (
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
  );
};
