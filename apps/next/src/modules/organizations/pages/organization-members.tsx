import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";

import type { MembershipRole } from "@quenti/prisma/client";
import { api } from "@quenti/trpc";

import {
  Box,
  Button,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Skeleton,
  SlideFade,
  Stack,
  Tag,
  useColorModeValue,
} from "@chakra-ui/react";

import { IconEdit, IconPlus, IconSearch, IconUserX } from "@tabler/icons-react";

import { MemberComponent } from "../../../components/member-component";
import { plural } from "../../../utils/string";
import { EditMemberModal } from "../edit-member-modal";
import { InviteMemberModal } from "../invite-member-modal";
import { OrganizationAdminOnly } from "../organization-admin-only";
import { RemoveMemberModal } from "../remove-member-modal";
import { getBaseDomain } from "../utils/get-base-domain";

export const OrganizationMembers = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const { data: session } = useSession();

  const { data: org } = api.organizations.get.useQuery(
    { id },
    {
      enabled: !!id && !!session?.user,
    },
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
    "user",
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
      m.user.username?.toLowerCase().includes(refined)
    );
  };

  const pendingFilterFn = (m: (typeof pending)[number]) => {
    const refined = search.trim().toLowerCase();
    if (!refined.length) return true;

    return m.email?.toLowerCase().includes(refined);
  };

  const canManage = (targetRole: MembershipRole) =>
    me
      ? me.role !== "Member" && (targetRole !== "Owner" || me.role === "Owner")
      : false;

  const editMemberCallback = React.useCallback((id: string) => {
    setEditMemberType("user");
    setEditMember(id);
  }, []);
  const removeMemberCallback = React.useCallback((id: string) => {
    setRemoveMemberType("user");
    setRemoveMember(id);
  }, []);
  const editInviteCallback = React.useCallback((id: string) => {
    setEditMemberType("invite");
    setEditMember(id);
  }, []);
  const removeInviteCallback = React.useCallback((id: string) => {
    setRemoveMemberType("invite");
    setRemoveMember(id);
  }, []);

  const borderColor = useColorModeValue("gray.200", "gray.700");
  const menuBg = useColorModeValue("white", "gray.800");

  return (
    <Stack spacing="10" pb="20">
      <Stack spacing="6">
        {org && (
          <>
            <InviteMemberModal
              isOpen={inviteModalOpen}
              onClose={() => setInviteModalOpen(false)}
              orgId={org.id}
              token={org.inviteToken?.token}
              domain={getBaseDomain(org)!.requestedDomain}
            />
            <EditMemberModal
              isOpen={!!editMember}
              onClose={() => setEditMember(undefined)}
              id={editMember || ""}
              role={
                editMemberType == "user"
                  ? org.members.find((m) => m.id == editMember)?.role ||
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
                  "member",
                )}`}
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
              Invite
            </Button>
          </OrganizationAdminOnly>
        </HStack>
        {org ? (
          <SlideFade in={!!org} offsetY="20px">
            <Box
              border="1px solid"
              rounded="lg"
              borderColor={borderColor}
              bg={menuBg}
            >
              {me && filterFn(me) && (
                <MemberComponent
                  id={me.id}
                  email={me.user.email}
                  user={me.user}
                  isMe
                  additionalTags={
                    <>
                      {me.role !== "Member" && (
                        <Tag
                          size="sm"
                          colorScheme={me.role == "Owner" ? "purple" : "gray"}
                        >
                          {me.role}
                        </Tag>
                      )}
                    </>
                  }
                />
              )}
              {others.filter(filterFn).map((m) => (
                <MemberComponent
                  key={m.user.id}
                  id={m.id}
                  email={m.user.email}
                  user={m.user}
                  additionalTags={
                    <>
                      {m.role !== "Member" && (
                        <Tag
                          size="sm"
                          colorScheme={m.role == "Owner" ? "purple" : "gray"}
                        >
                          {m.role}
                        </Tag>
                      )}
                    </>
                  }
                  canManage={canManage(m.role)}
                  actions={[
                    {
                      label: "Edit",
                      icon: IconEdit,
                      onClick: editMemberCallback,
                    },
                    {
                      label: "Remove",
                      icon: IconUserX,
                      onClick: removeMemberCallback,
                      destructive: true,
                    },
                  ]}
                />
              ))}
              {pending.filter(pendingFilterFn).map((m) => (
                <MemberComponent
                  key={m.id}
                  id={m.id}
                  email={m.email}
                  user={m.user ?? undefined}
                  canManage={canManage("Member")}
                  pending
                  actions={[
                    {
                      label: "Edit",
                      icon: IconEdit,
                      onClick: editInviteCallback,
                    },
                    {
                      label: "Remove",
                      icon: IconUserX,
                      onClick: removeInviteCallback,
                    },
                  ]}
                />
              ))}
            </Box>
          </SlideFade>
        ) : (
          <Box
            border="1px solid"
            rounded="lg"
            borderColor={borderColor}
            bg={menuBg}
          >
            {Array.from({ length: 10 }).map((_, i) => (
              <MemberComponent
                key={i}
                id=""
                skeleton
                email="placeholder@example.com"
                user={{
                  name: "Jonathan Doe",
                  username: "johndoe",
                  image: null,
                }}
              />
            ))}
          </Box>
        )}
      </Stack>
    </Stack>
  );
};
