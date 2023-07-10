import {
  Button,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Skeleton,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import { api } from "../../../utils/api";
import { plural } from "../../../utils/string";
import { EditMemberModal } from "../edit-member-modal";
import { InviteMemberModal } from "../invite-member-modal";
import { OrganizationAdminOnly } from "../organization-admin-only";
import { OrganizationMember } from "../organization-member";
import { RemoveMemberModal } from "../remove-member-modal";

export const OrganizationMembers = () => {
  const router = useRouter();
  const slug = router.query.slug as string;
  const { data: session } = useSession();

  const { data: org } = api.organizations.get.useQuery(slug, {
    enabled: !!slug,
  });

  const me = org
    ? org.members.find((m) => m.userId == session?.user?.id)
    : undefined;
  const others = org
    ? org.members.filter((m) => m.userId != session?.user?.id)
    : [];

  const [inviteModalOpen, setInviteModalOpen] = React.useState(false);
  const [editMember, setEditMember] = React.useState<string | undefined>();
  const [removeMember, setRemoveMember] = React.useState<string | undefined>();
  const [search, setSearch] = React.useState("");

  const menuBg = useColorModeValue("white", "gray.800");

  return (
    <Stack spacing="6">
      {org && (
        <>
          <InviteMemberModal
            isOpen={inviteModalOpen}
            onClose={() => setInviteModalOpen(false)}
            orgId={org.id}
            token={org.inviteToken?.token}
          />
          <EditMemberModal
            isOpen={!!editMember}
            onClose={() => setEditMember(undefined)}
            id={editMember || ""}
            role={
              org.members.find((m) => m.userId == editMember)?.role || "Member"
            }
          />
          <RemoveMemberModal
            isOpen={!!removeMember}
            onClose={() => setRemoveMember(undefined)}
            id={removeMember || ""}
          />
        </>
      )}
      <HStack>
        <Skeleton rounded="md" fitContent isLoaded={!!org} w="full">
          <InputGroup bg={menuBg} shadow="sm" rounded="md">
            <InputLeftElement pointerEvents="none" pl="2" color="gray.500">
              <IconSearch size={18} />
            </InputLeftElement>
            <Input
              placeholder={`Search ${plural(
                org?.members.length || 0,
                "member"
              )}...`}
              pl="44px"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>
        </Skeleton>
        <OrganizationAdminOnly>
          <Button
            leftIcon={<IconPlus size={18} />}
            onClick={() => setInviteModalOpen(true)}
          >
            Add
          </Button>
        </OrganizationAdminOnly>
      </HStack>
      <Stack pb="20">
        {me && (
          <OrganizationMember
            user={me.user}
            role={me.role}
            accepted
            isCurrent
          />
        )}
        {org
          ? others.map((m) => (
              <OrganizationMember
                key={m.user.id}
                user={m.user}
                role={m.role}
                accepted={m.accepted}
                onRequestEdit={() => setEditMember(m.user.id)}
                onRequestRemove={() => setRemoveMember(m.user.id)}
              />
            ))
          : Array.from({ length: 10 }).map((_, i) => (
              <OrganizationMember
                key={i}
                skeleton
                user={{
                  id: "",
                  name: "Jonathan Doe",
                  username: "johndoe",
                  email: "placeholder@example.com",
                  image: null,
                }}
                role={"Member"}
              />
            ))}
      </Stack>
    </Stack>
  );
};
