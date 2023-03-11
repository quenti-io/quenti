import {
  Avatar,
  AvatarBadge,
  Button,
  Stack,
  Text,
  useColorMode,
  useColorModeValue,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import {
  IconLogout,
  IconMoon,
  IconSettings,
  IconSun,
  IconUserCircle,
} from "@tabler/icons-react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { avatarUrl } from "../../utils/avatar";
import { Link } from "../link";

interface MobileUserOptionsProps {
  closeMenu: () => void;
}

export const MobileUserOptions: React.FC<MobileUserOptionsProps> = ({
  closeMenu,
}) => {
  const router = useRouter();
  const onStaticPage = router.pathname === "/" || router.pathname === "/404";

  const session = useSession()!.data!;
  const user = session.user!;

  const { colorMode, toggleColorMode } = useColorMode();
  const color = useColorModeValue("black", "white");

  return (
    <Stack spacing={6}>
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
      </Wrap>
      <Stack spacing={4}>
        <Button
          variant="outline"
          as={Link}
          href={`/@${user.username}`}
          leftIcon={<IconUserCircle size={18} />}
        >
          Profile
        </Button>
        <Button
          variant="outline"
          as={Link}
          href={`/settings`}
          leftIcon={<IconSettings size={18} />}
        >
          Settings
        </Button>
        {!onStaticPage && (
          <Button
            leftIcon={
              colorMode == "dark" ? (
                <IconSun size={18} />
              ) : (
                <IconMoon size={18} />
              )
            }
            onClick={() => {
              toggleColorMode();
              closeMenu();
            }}
            variant="outline"
          >
            {colorMode == "dark" ? "Light mode" : "Dark mode"}
          </Button>
        )}
        <Button
          variant="outline"
          leftIcon={<IconLogout size={18} />}
          onClick={async () => {
            await signOut({
              callbackUrl: "/",
            });
          }}
        >
          Sign out
        </Button>
      </Stack>
    </Stack>
  );
};
