import { Modal } from "@quenti/components/modal";
import { api } from "@quenti/trpc";

import { Button, ButtonGroup, Text } from "@chakra-ui/react";

import { useOrganization } from "../../hooks/use-organization";

interface RemoveDomainModalProps {
  isOpen: boolean;
  onClose: () => void;
  id: string;
  domain: string;
}

export const RemoveDomainModal: React.FC<RemoveDomainModalProps> = ({
  isOpen,
  onClose,
  id,
  domain,
}) => {
  const utils = api.useUtils();
  const { data: org } = useOrganization();

  const removeStudentDomain = api.organizations.removeStudentDomain.useMutation(
    {
      onSuccess: async () => {
        await utils.organizations.get.invalidate();
        onClose();
      },
    },
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Body>
          <Modal.Heading>Remove {domain}</Modal.Heading>
          <Text>
            All students associated with this domain will be automatically
            disbanded from the organization. This action cannot be undone; you
            will have to readd the domain manually.
          </Text>
        </Modal.Body>
        <Modal.Divider />
        <Modal.Footer>
          <ButtonGroup>
            <Button onClick={onClose} variant="ghost" colorScheme="gray">
              Cancel
            </Button>
            <Button
              isLoading={removeStudentDomain.isLoading}
              onClick={() => {
                removeStudentDomain.mutate({ orgId: org!.id, domainId: id });
              }}
              variant="outline"
              colorScheme="red"
            >
              Remove domain
            </Button>
          </ButtonGroup>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};
