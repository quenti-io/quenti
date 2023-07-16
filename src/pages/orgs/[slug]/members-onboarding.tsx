import {
  Avatar,
  Button,
  Card,
  Divider,
  Fade,
  HStack,
  Skeleton,
  Stack,
  Tag,
  Text,
} from "@chakra-ui/react";
import { IconUserPlus, IconWorld } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { WizardLayout } from "../../../components/wizard-layout";
import { api } from "../../../utils/api";
import { avatarUrl } from "../../../utils/avatar";

export default function OrgMembersOnboarding() {
  const router = useRouter();
  const slug = router.query.slug as string;
  const { data: session } = useSession();

  const { data: org } = api.organizations.get.useQuery(
    { slug },
    {
      enabled: !!slug && !!session?.user?.id,
      retry: false,
    }
  );

  const publish = api.organizations.publish.useMutation({
    onSuccess: async ({ callback }) => {
      await router.push(callback);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const me = org
    ? org.members.find((m) => m.userId == session?.user?.id)?.user
    : undefined;

  return (
    <WizardLayout
      title="Invite members"
      description="Invite additional members to your organization."
      steps={2}
      currentStep={1}
    >
      <Card p="8" variant="outline" shadow="lg" rounded="lg">
        <Stack spacing="6">
          <HStack spacing="4">
            <Skeleton isLoaded={!!me} fitContent rounded="full">
              <Avatar
                size="sm"
                src={me ? avatarUrl({ ...me, image: me.image! }) : ""}
              />
            </Skeleton>
            <Stack spacing="0">
              <Skeleton isLoaded={!!me} fitContent>
                <HStack>
                  <Text fontWeight={700} fontFamily="Outfit">
                    {me?.name || "placeholder text"}
                  </Text>
                  <Tag size="sm" colorScheme="blue">
                    You
                  </Tag>
                </HStack>
              </Skeleton>
              <Skeleton isLoaded={!!me} fitContent>
                <Text fontSize="sm" color="gray.500">
                  Owner
                </Text>
              </Skeleton>
            </Stack>
          </HStack>
          <Divider />
          <Skeleton w="full" rounded="md" isLoaded={!!org}>
            <Fade in={!!org}>
              <Button w="full" size="sm" leftIcon={<IconUserPlus size={16} />}>
                Add organization member
              </Button>
            </Fade>
          </Skeleton>
          <Skeleton w="full" rounded="md" isLoaded={!!org}>
            <Fade in={!!org}>
              <Button
                w="full"
                size="sm"
                leftIcon={<IconWorld size={16} />}
                onClick={() => {
                  publish.mutate({ orgId: org!.id });
                }}
                isLoading={publish.isLoading}
              >
                Publish organization
              </Button>
            </Fade>
          </Skeleton>
        </Stack>
      </Card>
    </WizardLayout>
  );
}
