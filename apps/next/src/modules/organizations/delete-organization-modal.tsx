import { useRouter } from "next/router";
import React from "react";

import { api } from "@quenti/trpc";

import { Button, ButtonGroup, Text, useColorModeValue } from "@chakra-ui/react";

import { Modal } from "@quenti/components/modal";
import { useOrganization } from "../../hooks/use-organization";

interface DeleteOrganizationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeleteOrganizationModal: React.FC<
  DeleteOrganizationModalProps
> = ({ isOpen, onClose }) => {
  const utils = api.useContext();
  const { data: org } = useOrganization();
  const router = useRouter();

  const apiDelete = api.organizations.delete.useMutation({
    onSuccess: async () => {
      await utils.user.me.invalidate();
      await router.push("/orgs");
    },
  });

  const cancelRef = React.useRef<HTMLButtonElement>(null);
  const mutedColor = useColorModeValue("gray.700", "gray.300");

  return (
    <Modal isOpen={isOpen} onClose={onClose} initialFocusRef={cancelRef}>
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Body spacing="2">
          <Modal.Heading>Delete organization</Modal.Heading>
          <Text color={mutedColor}>
            Are you sure you want to delete your organization? All members and
            students will be disbanded from the organization. Your billing will
            automatically be cancelled. <b>This action is irreversible.</b>
          </Text>
        </Modal.Body>
        <Modal.Divider />
        <Modal.Footer>
          <ButtonGroup>
            <Button
              onClick={onClose}
              ref={cancelRef}
              isDisabled={apiDelete.isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                apiDelete.mutate({ orgId: org!.id });
              }}
              isLoading={apiDelete.isLoading}
              colorScheme="red"
              variant="ghost"
            >
              Yes, delete organization
            </Button>
          </ButtonGroup>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};
