import { useRouter } from "next/router";
import React from "react";

import { Link, Modal } from "@quenti/components";
import { WEBSITE_URL } from "@quenti/lib/constants/url";

import { Button, VStack } from "@chakra-ui/react";

import { IconBuildingSkyscraper } from "@tabler/icons-react";

import { menuEventChannel } from "../events/menu";
import { GhostMessage } from "./ghost-message";

export const CreateClassNotice = () => {
  const router = useRouter();

  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const open = () => setOpen(true);

    menuEventChannel.on("openCreateClassNotice", open);
    return () => {
      menuEventChannel.off("openCreateClassNotice", open);
    };
  }, []);

  return (
    <Modal isOpen={open} onClose={() => setOpen(false)} size="2xl">
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Body>
          <Modal.CloseButton />
          <VStack spacing="8">
            <GhostMessage
              message="Coming soon"
              subheading={
                <>
                  Classes are not yet available for personal accounts. Create
                  and publish an organization to gain access to classes.{" "}
                  <Link
                    href={`${WEBSITE_URL}/organizations`}
                    fontWeight={600}
                    transition="color 0.2s ease-in-out"
                    color="gray.600"
                    _hover={{ color: "blue.500" }}
                    _dark={{
                      color: "gray.400",
                      _hover: { color: "blue.200" },
                    }}
                  >
                    Learn more
                  </Link>
                  .
                </>
              }
            />

            <Button
              variant="outline"
              leftIcon={<IconBuildingSkyscraper size={18} />}
              onClick={() => {
                void router.push("/orgs/new");
                setOpen(false);
              }}
            >
              Create an organization
            </Button>
          </VStack>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
};

export default CreateClassNotice;
