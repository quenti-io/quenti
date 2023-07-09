import { Button, Skeleton, Stack } from "@chakra-ui/react";
import { IconTrash } from "@tabler/icons-react";
import { useRouter } from "next/router";
import React from "react";
import { api } from "../../../utils/api";
import { DeleteModal } from "../delete-modal";
import { SettingsWrapper } from "../settings-wrapper";

export const OrganizationSettings = () => {
  const router = useRouter();
  const slug = router.query.slug as string;

  const [deleteOpen, setDeleteOpen] = React.useState(false);

  const { data: org } = api.organizations.get.useQuery(slug, {
    enabled: !!slug,
  });

  const apiDelete = api.organizations.delete.useMutation({
    onSuccess: async () => {
      await router.push("/orgs");
    },
  });

  return (
    <Stack spacing="5">
      <DeleteModal
        isOpen={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
        }}
        orgName={org?.name || ""}
        isLoading={apiDelete.isLoading}
        onDelete={() => {
          apiDelete.mutate(org!.id);
        }}
      />
      <SettingsWrapper
        heading="Danger Zone"
        description="Actions in this area are irreversible"
        isLoaded={!!org}
      >
        <Skeleton isLoaded={!!org} rounded="md" fitContent>
          <Button
            colorScheme="red"
            variant="outline"
            leftIcon={<IconTrash size={18} />}
            w="max"
            onClick={() => setDeleteOpen(true)}
          >
            Delete {org?.name || "Organization"}
          </Button>
        </Skeleton>
      </SettingsWrapper>
    </Stack>
  );
};
