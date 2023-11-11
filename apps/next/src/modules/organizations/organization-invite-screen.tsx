import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import { api } from "@quenti/trpc";

import {
  Box,
  Button,
  Center,
  Heading,
  ScaleFade,
  Stack,
  Text,
  VStack,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";

import { AnimatedCheckCircle } from "../../components/animated-icons/check";
import { Toast } from "../../components/toast";
import { useMe } from "../../hooks/use-me";
import { OrganizationCard } from "./organization-card";

export const OrganizationInviteScreen = () => {
  const utils = api.useUtils();
  const router = useRouter();
  const { data: me } = useMe();
  const { data: session } = useSession();

  const invite =
    me?.orgInvites.find((i) => i.organization.published)?.organization ||
    me?.orgInvites[0]?.organization;

  const toast = useToast();

  const setUserType = api.user.setUserType.useMutation();
  const acceptInvite = api.organizations.acceptInvite.useMutation({
    onSuccess: async () => {
      if (acceptInvite.variables?.accept) {
        await router.push(`/orgs/${invite!.id}`);
        toast({
          title: `Successfully joined ${invite!.name}`,
          status: "success",
          colorScheme: "green",
          icon: <AnimatedCheckCircle />,
          render: Toast,
        });
      } else {
        await router.push(`/home`);
      }

      await utils.user.me.invalidate();
    },
  });

  const ensureIsTeacher = async () => {
    if (session?.user?.type == "Student") {
      await setUserType.mutateAsync({ type: "Teacher" });
    }
  };

  const muted = useColorModeValue("gray.700", "gray.300");

  if (!invite) return null;

  return (
    <Center w="100vw" minH="calc(100vh - 80px)">
      <ScaleFade in>
        <VStack spacing="12">
          <VStack>
            <Heading>Join organization</Heading>
            <Text color={muted}>
              You&apos;ve been invited to join the following organization:
            </Text>
          </VStack>
          <Box w="lg">
            <OrganizationCard
              id={invite.id}
              logoUrl={invite.logoUrl}
              logoHash={invite.logoHash}
              name={invite.name}
              members={invite._count.members}
              students={invite._count.users}
              disableLink
            />
          </Box>
          <Stack w="xs">
            <Button
              isLoading={
                acceptInvite.isLoading && acceptInvite.variables?.accept
              }
              onClick={async () => {
                await ensureIsTeacher();

                await acceptInvite.mutateAsync({
                  accept: true,
                  orgId: invite.id,
                });
              }}
            >
              Accept invite
            </Button>
            <Button
              variant="ghost"
              isLoading={
                acceptInvite.isLoading && !acceptInvite.variables?.accept
              }
              onClick={async () => {
                await ensureIsTeacher();

                await acceptInvite.mutateAsync({
                  accept: false,
                  orgId: invite.id,
                });
              }}
            >
              Reject
            </Button>
          </Stack>
        </VStack>
      </ScaleFade>
    </Center>
  );
};
