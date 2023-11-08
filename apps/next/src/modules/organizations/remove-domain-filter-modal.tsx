import { api } from "@quenti/trpc";

import { ConfirmModal } from "../../components/confirm-modal";
import { useOrganization } from "../../hooks/use-organization";
import { getBaseDomain } from "./utils/get-base-domain";

export interface RemoveDomainFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RemoveDomainFilterModal: React.FC<
  RemoveDomainFilterModalProps
> = ({ isOpen, onClose }) => {
  const { data: org } = useOrganization();
  const domain = getBaseDomain(org);
  const utils = api.useUtils();

  const setDomainFilter = api.organizations.setDomainFilter.useMutation({
    onSuccess: async () => {
      await utils.organizations.get.invalidate();
      onClose();
    },
  });

  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      heading="Remove domain filter"
      body="Are you sure you want to remove your domain filter?"
      actionText="Remove"
      destructive
      onConfirm={() => {
        setDomainFilter.mutate({
          orgId: org!.id,
          domainId: domain!.id,
          filter: null,
        });
      }}
      isLoading={setDomainFilter.isLoading}
    />
  );
};
