import { Button, ButtonGroup, Text } from "@chakra-ui/react";
import { api } from "@quenti/trpc";
import { Modal } from "../../components/modal";
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
  const utils = api.useContext();
  const { data: org } = useOrganization();

  const removeStudentDomain = api.organizations.removeStudentDomain.useMutation(
    {
      onSuccess: async () => {
        await utils.organizations.get.invalidate();
        onClose();
      },
    }
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Body>
          <Modal.Heading>Remove {domain}</Modal.Heading>
          <Text>
            All students associated this domain will be automatically disbanded
            from the organization. This action cannot be undone, you will have
            to readd the domain manually.
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
