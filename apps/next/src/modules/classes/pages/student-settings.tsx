import { useRouter } from "next/router";
import React from "react";

import { api } from "@quenti/trpc";

import {
  Button,
  Divider,
  Flex,
  HStack,
  Heading,
  Skeleton,
  Stack,
  useToast,
} from "@chakra-ui/react";

import { IconLogout, IconSettings } from "@tabler/icons-react";

import { AnimatedCheckCircle } from "../../../components/animated-icons/check";
import { ConfirmModal } from "../../../components/confirm-modal";
import { Toast } from "../../../components/toast";
import { SettingsWrapper } from "../../organizations/settings-wrapper";
import { useProtectedRedirect } from "../use-protected-redirect";

export const StudentSettings = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const isLoaded = useProtectedRedirect({ for: "Student" });
  const toast = useToast();

  const [leaveOpen, setLeaveOpen] = React.useState(false);

  const leave = api.classes.leave.useMutation({
    onSuccess: async () => {
      await router.push("/home");

      toast({
        title: "Left class successfully",
        icon: <AnimatedCheckCircle />,
        render: Toast,
      });
    },
  });

  return (
    <>
      <ConfirmModal
        isOpen={leaveOpen}
        onClose={() => setLeaveOpen(false)}
        heading="Leave class"
        body="Are you sure you want to leave this class? You will not be able to access it again until you rejoin."
        isLoading={leave.isLoading}
        onConfirm={() => {
          if (!id) return;
          leave.mutate({
            id,
          });
        }}
        actionText="Leave class"
        destructive
      />

      <Stack spacing="8" mt="8">
        <Flex justifyContent="space-between">
          <Skeleton rounded="md" isLoaded={isLoaded}>
            <HStack>
              <IconSettings />
              <Heading size="lg">Settings</Heading>
            </HStack>
          </Skeleton>
        </Flex>
        <Divider
          borderColor="gray.300"
          _dark={{
            borderColor: "gray.600",
          }}
        />
        <SettingsWrapper
          heading="Danger zone"
          description="Actions in this area are irreversible"
          isLoaded={isLoaded}
        >
          <Skeleton rounded="lg" isLoaded={isLoaded} fitContent>
            <Button
              w="max"
              variant="outline"
              colorScheme="gray"
              leftIcon={<IconLogout size={18} />}
              onClick={() => setLeaveOpen(true)}
            >
              Leave class
            </Button>
          </Skeleton>
        </SettingsWrapper>
      </Stack>
    </>
  );
};
