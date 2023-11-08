import React from "react";

import { Modal } from "@quenti/components/modal";
import type { MembershipRole } from "@quenti/prisma/client";
import { api } from "@quenti/trpc";

import { Button, ButtonGroup, FormControl, FormLabel } from "@chakra-ui/react";

import { useOrganization } from "../../hooks/use-organization";
import { useOrganizationMember } from "../../hooks/use-organization-member";
import { MemberRoleSelect } from "./member-role-select";

export interface EditMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  id: string;
  type: "user" | "invite";
  role: MembershipRole;
}

export const EditMemberModal: React.FC<EditMemberModalProps> = ({
  isOpen,
  onClose,
  id,
  type,
  role: _role,
}) => {
  const { data: org } = useOrganization();
  const me = useOrganizationMember();
  const utils = api.useUtils();
  const myRole = me?.role || "Member";

  const [role, setRole] = React.useState<MembershipRole>(_role);
  React.useEffect(() => {
    setRole(_role);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const editMemberRole = api.organizations.editMemberRole.useMutation({
    onSuccess: async () => {
      onClose();
      await utils.organizations.get.invalidate();
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Body>
          <Modal.Heading>Edit member</Modal.Heading>
          <FormControl>
            <FormLabel>Role</FormLabel>
            <MemberRoleSelect value={role} onChange={setRole} myRole={myRole} />
          </FormControl>
        </Modal.Body>
        <Modal.Divider />
        <Modal.Footer>
          <ButtonGroup>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                editMemberRole.mutate({
                  orgId: org!.id,
                  genericId: id,
                  role,
                  type,
                });
              }}
              isLoading={editMemberRole.isLoading}
            >
              Update
            </Button>
          </ButtonGroup>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};
