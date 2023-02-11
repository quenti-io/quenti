import {
  Button,
  Collapse,
  Link,
  Menu,
  MenuButton,
  MenuList,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  IconBooks,
  IconChevronDown,
  IconCloudDownload,
  IconFolder,
} from "@tabler/icons-react";
import { signIn, useSession } from "next-auth/react";
import { MenuOption } from "../menu-option";
import { MobileUserOptions } from "./mobile-user-options";

export interface MobileMenuProps {
  isOpen: boolean;
  onFolderClick: () => void;
  onImportClick: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onFolderClick,
  onImportClick,
}) => {
  const { data: session, status } = useSession()!;
  const bgGradient = useColorModeValue(
    "linear(to-b, gray.50, white)",
    "linear(to-b, gray.900, gray.800)"
  );
  const menuBg = useColorModeValue("white", "gray.800");

  return (
    <Collapse in={isOpen}>
      <Stack
        pos="absolute"
        insetX={0}
        bgGradient={bgGradient}
        px="6"
        py="10"
        spacing={8}
      >
        <Stack spacing={4}>
          {session?.user && (
            <Button
              as={Link}
              href="/home"
              variant="outline"
              colorScheme="gray"
              fontWeight={700}
              fontSize="sm"
            >
              Home
            </Button>
          )}
          {session?.user?.admin && (
            <Button
              as={Link}
              href="/admin"
              variant="outline"
              colorScheme="gray"
              fontWeight={700}
              fontSize="sm"
            >
              Admin
            </Button>
          )}
          {session?.user && (
            <Menu boundary="scrollParent" placement="bottom">
              <MenuButton>
                <Button
                  w="full"
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
                w="calc(100vw - 48px)"
              >
                <MenuOption
                  icon={<IconBooks size={20} />}
                  label="Study set"
                  link="/create"
                />
                <MenuOption
                  icon={<IconCloudDownload size={20} />}
                  label="Import from Quizlet"
                  onClick={onImportClick}
                />
                <MenuOption
                  icon={<IconFolder size={20} />}
                  label="Folder"
                  onClick={onFolderClick}
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
        </Stack>
        {session?.user && <MobileUserOptions />}
      </Stack>
    </Collapse>
  );
};
