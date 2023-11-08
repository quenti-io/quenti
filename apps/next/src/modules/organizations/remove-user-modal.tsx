import React from "react";

import { api } from "@quenti/trpc";

import { Stack, Text } from "@chakra-ui/react";

import { ConfirmModal } from "../../components/confirm-modal";
import { useOrganization } from "../../hooks/use-organization";

export interface RemoveUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  id: string;
}

export const RemoveStudentModal: React.FC<RemoveUserModalProps> = ({
  isOpen,
  onClose,
  id,
}) => {
  const { data: org } = useOrganization();
  const utils = api.useUtils();

  const [error, setError] = React.useState<string | null>(null);

  const removeStudent = api.organizations.removeUser.useMutation({
    onSuccess: async () => {
      onClose();
      await utils.organizations.getUsers.invalidate();
    },
    onError: (error) => {
      if (error.message == "user_is_org_member") {
        setError(
          "This user is a member of your organization. Remove them as a member from the organization first.",
        );
      }
    },
  });

  React.useEffect(() => {
    setError(null);
  }, [isOpen]);

  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      heading="Remove user"
      body={
        <Stack>
          <Text>
            Are you sure you want to remove this user from the organization?
            Their account will not be deleted, but they will be removed from all
            classes created under the organization.
          </Text>
          {error ? (
            <Text
              color="red.600"
              fontWeight={500}
              fontSize="sm"
              _dark={{
                color: "red.300",
              }}
            >
              {error}
            </Text>
          ) : null}
        </Stack>
      }
      actionText="Remove user"
      destructive
      isLoading={removeStudent.isLoading}
      onConfirm={() =>
        removeStudent.mutate({
          orgId: org!.id,
          userId: id,
        })
      }
    />
  );
};
