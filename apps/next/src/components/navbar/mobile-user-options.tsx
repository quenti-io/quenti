import { signOut, useSession } from "next-auth/react";

import { Link } from "@quenti/components";
import { avatarUrl } from "@quenti/lib/avatar";

import {
  Avatar,
  AvatarBadge,
  Button,
  HStack,
  IconButton,
  Stack,
  Text,
  Wrap,
  WrapItem,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";

import {
  IconBuildingSkyscraper,
  IconLogout,
  IconMoon,
  IconSettings,
  IconSun,
  IconUserCircle,
} from "@tabler/icons-react";

import { useMe } from "../../hooks/use-me";
import { TeacherOnly } from "../teacher-only";

interface MobileUserOptionsProps {
  closeMenu: () => void;
}

export const MobileUserOptions: React.FC<MobileUserOptionsProps> = ({
  closeMenu,
}) => {
  const session = useSession()!.data!;
  const user = session.user!;

  const { data: me } = useMe();

  const { colorMode, toggleColorMode } = useColorMode();
  const color = useColorModeValue("black", "white");

  return (
    <Stack spacing={6}>
      <HStack justifyContent="space-between">
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
        {me?.orgMembership && (
          <TeacherOnly>
            <IconButton
              variant="outline"
              overflow="hidden"
              textOverflow="ellipsis"
              colorScheme="gray"
              as={Link}
              aria-label="Organization"
              href={`/orgs/${me.orgMembership.organization.id}`}
              icon={<IconBuildingSkyscraper size={18} />}
            />
          </TeacherOnly>
        )}
      </HStack>
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
        <Button
          leftIcon={
            colorMode == "dark" ? <IconSun size={18} /> : <IconMoon size={18} />
          }
          onClick={() => {
            toggleColorMode();
            closeMenu();
          }}
          variant="outline"
        >
          {colorMode == "dark" ? "Light mode" : "Dark mode"}
        </Button>
        <Button
          variant="outline"
          leftIcon={<IconLogout size={18} />}
          onClick={async () => {
            await signOut({
              callbackUrl: "/auth/login",
            });
          }}
        >
          Sign out
        </Button>
      </Stack>
    </Stack>
  );
};
