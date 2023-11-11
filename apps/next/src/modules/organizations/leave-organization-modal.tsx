import { useRouter } from "next/router";

import { Modal } from "@quenti/components/modal";
import { api } from "@quenti/trpc";

import { Button, ButtonGroup, Text, useToast } from "@chakra-ui/react";

import { AnimatedCheckCircle } from "../../components/animated-icons/check";
import { Toast } from "../../components/toast";
import { useOrganization } from "../../hooks/use-organization";
import { useOrganizationMember } from "../../hooks/use-organization-member";

export interface RemoveMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LeaveOrganizationModal: React.FC<RemoveMemberModalProps> = ({
  isOpen,
  onClose,
}) => {
  const utils = api.useUtils();
  const router = useRouter();
  const toast = useToast();

  const { data: org } = useOrganization();
  const me = useOrganizationMember();

  const removeMember = api.organizations.removeMember.useMutation({
    onSuccess: async () => {
      await utils.user.me.invalidate();

      toast({
        title: "Left organization",
        icon: <AnimatedCheckCircle />,
        render: Toast,
      });

      await router.push("/home");
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Body spacing="2">
          <Modal.Heading>Leave organization</Modal.Heading>
          <Text>Are you sure you want to leave this organization?</Text>
        </Modal.Body>
        <Modal.Divider />
        <Modal.Footer>
          <ButtonGroup>
            <Button variant="ghost" onClick={onClose} colorScheme="gray">
              Cancel
            </Button>
            <Button
              isLoading={removeMember.isLoading}
              variant="outline"
              colorScheme="red"
              onClick={() =>
                removeMember.mutate({
                  orgId: org!.id,
                  genericId: me!.id,
                  type: "user",
                })
              }
            >
              Leave
            </Button>
          </ButtonGroup>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};
