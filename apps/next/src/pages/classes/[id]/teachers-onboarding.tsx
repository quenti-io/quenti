import { useRouter } from "next/router";
import React from "react";

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
import { useClass } from "../../../hooks/use-class";
import { useClassMembers } from "../../../hooks/use-class-members";
import { getLayout } from "../../../layouts/main-layout";
import { InviteTeachersModal } from "../../../modules/classes/invite-teachers-modal";
import { useProtectedRedirect } from "../../../modules/classes/use-protected-redirect";
import { plural } from "../../../utils/string";

export default function TeachersOnboarding() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data: class_ } = useClass();
  const { data } = useClassMembers();
  const isReady = useProtectedRedirect();

  const isLoaded = isReady && !!data && !!class_;

  const others = data
    ? data.members.filter((m) => m.user.id != data.me.userId)
    : [];
  const pending = data ? data.invites : [];

  const all = data
    ? Array.from([data.me.id])
        .concat(others.map((x) => x.id))
        .concat(pending.map((x) => x.id))
    : [];
  const visible = all.slice(0, 4);
  const numHidden = all.length - visible.length;

  const [inviteModalOpen, setInviteModalOpen] = React.useState(false);

  return (
    <WizardLayout
      title="Invite teachers"
      seoTitle="Invite Teachers"
      description="Invite additional teachers to join your class."
      steps={4}
      currentStep={1}
    >
      <>
        {isLoaded && (
          <InviteTeachersModal
            isOpen={inviteModalOpen}
            onClose={() => setInviteModalOpen(false)}
          />
        )}
        <Stack spacing="6">
          <Flex px="8" justifyContent="space-between">
            <Skeleton
              fitContent
              w="max-content"
              rounded="md"
              isLoaded={isLoaded}
            >
              <Fade in={!!data}>
                <Button
                  w="full"
                  size="sm"
                  leftIcon={<IconUserPlus size={16} />}
                  onClick={() => setInviteModalOpen(true)}
                >
                  Add teachers
                </Button>
              </Fade>
            </Skeleton>
            <Skeleton fitContent rounded="md" isLoaded={isLoaded}>
              <Fade in={isLoaded}>
                <Button
                  w="full"
                  size="sm"
                  onClick={async () => {
                    await router.push(`/classes/${id}/create-sections`);
                  }}
                  variant="ghost"
                  rightIcon={<IconArrowRight size={18} />}
                >
                  {(data?.members.length || 1) + (data?.invites.length || 0) > 1
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
                  isLoaded={isLoaded}
                  isMe
                  nameOrEmail={data?.me?.user.name || data?.me?.user.username}
                  image={data?.me?.user.image}
                  label="Teacher"
                />
                {others
                  .filter((m) => visible.includes(m.id))
                  .map((m) => (
                    <OnboardingMember
                      key={m.id}
                      nameOrEmail={m.user.name || m.user.username}
                      image={m.user.image}
                      label="Teacher"
                    />
                  ))}
                {pending
                  .filter((m) => visible.includes(m.id))
                  .map((m) => (
                    <OnboardingMember
                      key={m.id}
                      nameOrEmail={m.user?.name ?? m.email}
                      label="Invited"
                      pending
                      image={m.user?.image}
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
      </>
    </WizardLayout>
  );
}

TeachersOnboarding.PageWrapper = PageWrapper;
TeachersOnboarding.getLayout = getLayout;
