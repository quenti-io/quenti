import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React from "react";

import { Link } from "@quenti/components";
import { avatarUrl } from "@quenti/lib/avatar";

import {
  Avatar,
  AvatarBadge,
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";

import { IconMenu, IconX } from "@tabler/icons-react";

import { menuEventChannel } from "../events/menu";

const ImportFromQuizletModal = dynamic(
  () => import("./import-from-quizlet-modal"),
  { ssr: false },
);
const LeftNav = dynamic(() => import("./navbar/left-nav"), { ssr: false });
const MobileMenu = dynamic(() => import("./navbar/mobile-menu"), {
  ssr: false,
});
const UserMenu = dynamic(() => import("./navbar/user-menu"), { ssr: false });

const CreateFolderModal = dynamic(() => import("./create-folder-modal"), {
  ssr: false,
});

export const Navbar: React.FC = () => {
  const router = useRouter();

  const { data: session, status } = useSession();
  const { isOpen: isMobileMenuOpen, onToggle: onMobileMenuToggle } =
    useDisclosure();
  const user = session?.user;

  const [folderModalOpen, setFolderModalOpen] = React.useState(false);
  const [folderChildSetId, setFolderChildSetId] = React.useState<string>();
  const [importIsEdit, setImportIsEdit] = React.useState(false);
  const [importModalOpen, setImportModalOpen] = React.useState(false);

  React.useEffect(() => {
    const createFolder = (setId?: string) => {
      setFolderChildSetId(setId);
      setFolderModalOpen(true);
    };
    const openImportDialog = (edit = false) => {
      setImportIsEdit(edit);
      setImportModalOpen(true);
    };
    const createClass = () => {
      void router.push("/classes/new");
    };

    menuEventChannel.on("createFolder", createFolder);
    menuEventChannel.on("openImportDialog", openImportDialog);
    menuEventChannel.on("createClass", createClass);
    return () => {
      menuEventChannel.off("createFolder", createFolder);
      menuEventChannel.off("openImportDialog", openImportDialog);
      menuEventChannel.off("createClass", createClass);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <CreateFolderModal
        isOpen={folderModalOpen}
        onClose={() => {
          setFolderModalOpen(false);
          setFolderChildSetId(undefined);
        }}
        childSetId={folderChildSetId}
      />
      <ImportFromQuizletModal
        isOpen={importModalOpen}
        onClose={() => {
          setImportModalOpen(false);
        }}
        edit={importIsEdit}
      />
      <Flex pos="relative" zIndex={1000} w="full">
        <HStack
          as="header"
          aria-label="Main navigation"
          w="full"
          mx="auto"
          px={{ base: "6", md: "8" }}
          py="4"
          justify="space-between"
        >
          <LeftNav
            onFolderClick={() => setFolderModalOpen(true)}
            onImportClick={() => {
              setImportIsEdit(false);
              setImportModalOpen(true);
            }}
            onClassClick={() => void router.push("/classes/new")}
          />
          <Box display={["block", "block", "none"]}>
            <HStack>
              {user && (
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
              )}
              <IconButton
                aria-label={"Open menu"}
                icon={
                  isMobileMenuOpen ? (
                    <IconX size={20} />
                  ) : (
                    <IconMenu size={20} />
                  )
                }
                variant="ghost"
                colorScheme="gray"
                onClick={onMobileMenuToggle}
              />
            </HStack>
            <MobileMenu
              isOpen={isMobileMenuOpen}
              onClose={onMobileMenuToggle}
              onFolderClick={() => setFolderModalOpen(true)}
              onImportClick={() => {
                setImportIsEdit(false);
                setImportModalOpen(true);
              }}
            />
          </Box>
          <HStack
            as="nav"
            spacing={4}
            display={["none", "none", "flex"]}
            height="12"
          >
            {session?.user && <UserMenu />}
            {status !== "loading" && !session && (
              <>
                <Button
                  colorScheme="blue"
                  variant="outline"
                  as={Link}
                  href="/auth/login"
                >
                  Log in
                </Button>
                <Button as={Link} href="/auth/signup">
                  Sign up for free
                </Button>
              </>
            )}
          </HStack>
        </HStack>
      </Flex>
    </>
  );
};

export default Navbar;
