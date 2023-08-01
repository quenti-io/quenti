import {
  Button,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Skeleton,
  SlideFade,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import { api } from "@quenti/trpc";
import { plural } from "../../../utils/string";
import { EditMemberModal } from "../edit-member-modal";
import { InviteMemberModal } from "../invite-member-modal";
import { OrganizationAdminOnly } from "../organization-admin-only";
import { OrganizationMember } from "../organization-member";
import { OrganizationWelcome } from "../organization-welcome";
import { RemoveMemberModal } from "../remove-member-modal";

export const OrganizationMembers = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const { data: session } = useSession();
  const isUpgraded = router.query.upgrade === "success";

  const { data: org } = api.organizations.get.useQuery(
    { id },
    {
      enabled: !!id && !!session?.user,
      retry: false,
    }
  );

  const me = org
    ? org.members.find((m) => m.userId == session?.user?.id)
    : undefined;
  const others = org
    ? org.members.filter((m) => m.userId != session?.user?.id)
    : [];
  const pending = org ? org.pendingInvites : [];

  const [inviteModalOpen, setInviteModalOpen] = React.useState(false);
  const [editMember, setEditMember] = React.useState<string | undefined>();
  const [editMemberType, setEditMemberType] = React.useState<"user" | "invite">(
    "user"
  );
  const [removeMember, setRemoveMember] = React.useState<string | undefined>();
  const [removeMemberType, setRemoveMemberType] = React.useState<
    "user" | "invite"
  >("user");
  const [search, setSearch] = React.useState("");

  const filterFn = (m: NonNullable<typeof me>) => {
    const refined = search.trim().toLowerCase();
    if (!refined.length) return true;

    return (
      m.user.name?.toLowerCase().includes(refined) ||
      m.user.email?.toLowerCase().includes(refined) ||
      m.user.username.toLowerCase().includes(refined)
    );
  };

  const pendingFilterFn = (m: (typeof pending)[number]) => {
    const refined = search.trim().toLowerCase();
    if (!refined.length) return true;

    return m.email?.toLowerCase().includes(refined);
  };

  const menuBg = useColorModeValue("white", "gray.800");

  return (
    <Stack spacing="6">
      {org && isUpgraded && org.published && <OrganizationWelcome />}
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
              editMemberType == "user"
                ? org.members.find((m) => m.userId == editMember)?.role ||
                  "Member"
                : org.pendingInvites.find((m) => m.id == editMember)?.role ||
                  "Member"
            }
            type={editMemberType}
          />
          <RemoveMemberModal
            isOpen={!!removeMember}
            onClose={() => setRemoveMember(undefined)}
            id={removeMember || ""}
            type={removeMemberType}
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
      {org ? (
        <SlideFade in={!!org} offsetY="20px">
          <Stack pb="20">
            {me && filterFn(me) && (
              <OrganizationMember
                user={me.user}
                role={me.role}
                accepted
                isCurrent
              />
            )}
            {others.filter(filterFn).map((m) => (
              <OrganizationMember
                key={m.user.id}
                user={m.user}
                role={m.role}
                accepted={m.accepted}
                onRequestEdit={() => {
                  setEditMemberType("user");
                  setEditMember(m.user.id);
                }}
                onRequestRemove={() => {
                  setRemoveMemberType("user");
                  setRemoveMember(m.user.id);
                }}
              />
            ))}
            {pending.filter(pendingFilterFn).map((m) => (
              <OrganizationMember
                key={m.id}
                user={{
                  id: "",
                  name: m.email,
                  username: "",
                  email: m.email,
                  image: null,
                }}
                role={m.role}
                accepted={false}
                isEmpty
                onRequestEdit={() => {
                  setEditMemberType("invite");
                  setEditMember(m.id);
                }}
                onRequestRemove={() => {
                  setRemoveMemberType("invite");
                  setRemoveMember(m.id);
                }}
              />
            ))}
          </Stack>
        </SlideFade>
      ) : (
        <Stack pb="20">
          {Array.from({ length: 10 }).map((_, i) => (
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
      )}
    </Stack>
  );
};
