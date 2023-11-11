import { Modal } from "@quenti/components/modal";
import { api } from "@quenti/trpc";

import { Button, ButtonGroup, Text } from "@chakra-ui/react";

import { useOrganization } from "../../hooks/use-organization";

export interface RemoveMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  id: string;
  type: "user" | "invite";
}

export const RemoveMemberModal: React.FC<RemoveMemberModalProps> = ({
  isOpen,
  onClose,
  id,
  type,
}) => {
  const { data: org } = useOrganization();
  const utils = api.useUtils();
  const removeMember = api.organizations.removeMember.useMutation({
    onSuccess: async () => {
      onClose();
      await utils.organizations.get.invalidate();
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Body spacing="2">
          <Modal.Heading>
            {type == "user" ? "Remove member" : "Remove invite"}
          </Modal.Heading>
          <Text>
            Are you sure you want to{" "}
            {type == "user"
              ? "remove this member from the organization"
              : "cancel this invite to the organization"}
            ?
          </Text>
        </Modal.Body>
        <Modal.Divider />
        <Modal.Footer>
          <ButtonGroup>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              isLoading={removeMember.isLoading}
              onClick={() =>
                removeMember.mutate({
                  orgId: org!.id,
                  genericId: id,
                  type,
                })
              }
            >
              {type == "user" ? "Remove member" : "Remove invite"}
            </Button>
          </ButtonGroup>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};
