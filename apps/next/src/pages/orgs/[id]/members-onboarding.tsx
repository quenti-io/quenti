import {
  Avatar,
  Button,
  Card,
  Fade,
  Flex,
  HStack,
  Skeleton,
  SkeletonText,
  Stack,
  Tag,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import type { MembershipRole } from "@quenti/prisma/client";
import { IconArrowRight, IconUserPlus } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import { WizardLayout } from "../../../components/wizard-layout";
import { InviteMemberModal } from "../../../modules/organizations/invite-member-modal";
import { OrganizationContext } from "../../../modules/organizations/organization-layout";
import { api } from "@quenti/trpc";

export default function OrgMembersOnboarding() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data: session } = useSession();

  const { data: org } = api.organizations.get.useQuery(
    { id },
    {
      enabled: !!id && !!session?.user?.id,
      retry: false,
    }
  );

  const me = org
    ? org.members.find((m) => m.user.id === session!.user!.id)
    : null;
  const others = org
    ? org.members.filter((m) => m.userId != session?.user?.id)
    : [];
  const pending = org ? org.pendingInvites : [];

  const all = org
    ? Array.from([me!.id])
        .concat(others.map((x) => x.id))
        .concat(pending.map((x) => x.id))
    : [];
  const visible = all.slice(0, 4);
  const numHidden = all.length - visible.length;

  const [inviteModalOpen, setInviteModalOpen] = React.useState(false);

  return (
    <WizardLayout
      title="Invite members"
      description="Invite additional members to join your organization."
      steps={5}
      currentStep={1}
    >
      <OrganizationContext.Provider value={org && me ? { ...org, me } : null}>
        {org && (
          <InviteMemberModal
            isOpen={inviteModalOpen}
            onClose={() => setInviteModalOpen(false)}
            orgId={org.id}
            token={org.inviteToken?.token}
          />
        )}
        <Stack spacing="6">
          <Flex px="8" justifyContent="space-between">
            <Skeleton fitContent w="max-content" rounded="md" isLoaded={!!org}>
              <Fade in={!!org}>
                <Button
                  w="full"
                  size="sm"
                  leftIcon={<IconUserPlus size={16} />}
                  onClick={() => setInviteModalOpen(true)}
                >
                  Add organization members
                </Button>
              </Fade>
            </Skeleton>
            <Skeleton fitContent rounded="md" isLoaded={!!org}>
              <Fade in={!!org}>
                <Button
                  w="full"
                  size="sm"
                  onClick={async () => {
                    await router.push(`/orgs/${org!.id}/domain-setup`);
                  }}
                  variant="ghost"
                  rightIcon={<IconArrowRight size={18} />}
                >
                  {(org?.members?.length || 1) > 1 ? "Next" : "Skip"}
                </Button>
              </Fade>
            </Skeleton>
          </Flex>
          <Card p="8" pb="4" variant="outline" shadow="lg" rounded="lg">
            <Stack spacing="4">
              <Stack spacing="0" ml="-4" mt="-4">
                <OnboardingMember
                  isLoaded={!!me}
                  isMe
                  nameOrEmail={me?.user.name}
                  image={me?.user.image}
                  role={me?.role || "Owner"}
                />
                {others
                  .filter((m) => visible.includes(m.id))
                  .map((m) => (
                    <OnboardingMember
                      key={m.id}
                      nameOrEmail={m.user.name}
                      image={m.user.image}
                      role={m.role}
                      pending={!m.accepted}
                    />
                  ))}
                {pending
                  .filter((m) => visible.includes(m.id))
                  .map((m) => (
                    <OnboardingMember
                      key={m.id}
                      nameOrEmail={m.email}
                      role={m.role}
                      pending
                    />
                  ))}
              </Stack>
              {numHidden > 0 && (
                <Text fontSize="md">
                  <b style={{ fontFamily: "Outfit" }}>+{numHidden}</b> member
                  {numHidden !== 1 && "s"} (hidden)
                </Text>
              )}
            </Stack>
          </Card>
          <Flex w="full" justifyContent="end"></Flex>
        </Stack>
      </OrganizationContext.Provider>
    </WizardLayout>
  );
}

interface OnboardingMemberProps {
  image?: string | null;
  nameOrEmail?: string | null;
  isMe?: boolean;
  pending?: boolean;
  role: MembershipRole;
  isLoaded?: boolean;
}

export const OnboardingMember: React.FC<OnboardingMemberProps> = ({
  image,
  nameOrEmail,
  isMe = false,
  pending = false,
  role,
  isLoaded = true,
}) => {
  const hoverBg = useColorModeValue("gray.50", "gray.750");
  return (
    <HStack
      spacing="4"
      py="2"
      px="4"
      rounded="md"
      transition="background 0.2s ease-in-out"
      _hover={{
        bg: hoverBg,
      }}
    >
      <Skeleton isLoaded={isLoaded} fitContent rounded="full">
        <Avatar size="sm" src={image || undefined} />
      </Skeleton>
      <Stack spacing="0">
        <Skeleton isLoaded={isLoaded} fitContent>
          <HStack>
            <Text fontWeight={700} fontFamily="Outfit">
              {nameOrEmail || "placeholder text"}
            </Text>
            {isMe && (
              <Tag size="sm" colorScheme="blue">
                You
              </Tag>
            )}
            {pending && (
              <Tag size="sm" colorScheme="orange">
                Pending
              </Tag>
            )}
          </HStack>
        </Skeleton>
        <Flex h="21px" alignItems="center">
          <SkeletonText
            isLoaded={isLoaded}
            noOfLines={1}
            fitContent
            skeletonHeight="3"
          >
            <Text fontSize="sm" color="gray.500">
              {role}
            </Text>
          </SkeletonText>
        </Flex>
      </Stack>
    </HStack>
  );
};
