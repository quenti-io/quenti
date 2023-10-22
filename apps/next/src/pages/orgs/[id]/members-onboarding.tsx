import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";

import { api } from "@quenti/trpc";

import {
  Button,
  Card,
  Fade,
  Flex,
  HStack,
  Skeleton,
  Stack,
  Text,
} from "@chakra-ui/react";

import {
  IconArrowRight,
  IconPointFilled,
  IconUserPlus,
  IconUsers,
} from "@tabler/icons-react";

import { PageWrapper } from "../../../common/page-wrapper";
import { OnboardingMember } from "../../../components/onboarding-member";
import { WizardLayout } from "../../../components/wizard-layout";
import { getLayout } from "../../../layouts/main-layout";
import { InviteMemberModal } from "../../../modules/organizations/invite-member-modal";
import { OnboardingMetadata } from "../../../modules/organizations/onboarding-metadata";
import { plural } from "../../../utils/string";

export default function OrgMembersOnboarding() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data: session } = useSession();

  const { data: org } = api.organizations.get.useQuery(
    { id },
    {
      enabled: !!id && !!session?.user?.id,
    },
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
    <OnboardingMetadata step="members-onboarding">
      <WizardLayout
        title="Invite members"
        seoTitle="Invite Members"
        description="Invite additional organization administrators to join. Members can manage organization activity, classes, teachers and students."
        steps={5}
        currentStep={1}
      >
        {org && (
          <InviteMemberModal
            isOpen={inviteModalOpen}
            onClose={() => setInviteModalOpen(false)}
            orgId={org.id}
            domain={org.domains.find((d) => d.type == "Base")!.requestedDomain}
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
                  {(org?.members?.length || 1) +
                    (org?.pendingInvites.length || 0) >
                  1
                    ? "Next"
                    : "Skip"}
                </Button>
              </Fade>
            </Skeleton>
          </Flex>
          <Card p="8" pb="4" variant="outline" shadow="lg" rounded="xl">
            <Stack spacing="4">
              <Stack spacing="0" ml="-4" mt="-4">
                <OnboardingMember
                  isLoaded={!!me}
                  isMe
                  nameOrEmail={me?.user.name}
                  image={me?.user.image}
                  label={me?.role || "Owner"}
                />
                {others
                  .filter((m) => visible.includes(m.id))
                  .map((m) => (
                    <OnboardingMember
                      key={m.id}
                      nameOrEmail={m.user.name}
                      image={m.user.image}
                      label={m.role}
                    />
                  ))}
                {pending
                  .filter((m) => visible.includes(m.id))
                  .map((m) => (
                    <OnboardingMember
                      key={m.id}
                      nameOrEmail={m.user?.name ?? m.email}
                      image={m.user?.image}
                      label={m.role}
                      pending
                    />
                  ))}
              </Stack>
              {numHidden > 0 && (
                <HStack color="gray.500" ml="2">
                  <IconUsers size={16} />
                  <HStack spacing="1">
                    <Text fontSize="sm">{plural(all.length, "member")}</Text>
                    <IconPointFilled size={8} />
                    <Text fontSize="sm">{numHidden} hidden</Text>
                  </HStack>
                </HStack>
              )}
            </Stack>
          </Card>
        </Stack>
      </WizardLayout>
    </OnboardingMetadata>
  );
}

OrgMembersOnboarding.PageWrapper = PageWrapper;
OrgMembersOnboarding.getLayout = getLayout;
