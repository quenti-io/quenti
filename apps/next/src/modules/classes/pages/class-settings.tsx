import {
  Button,
  ButtonGroup,
  Divider,
  Flex,
  HStack,
  Heading,
  Input,
  Skeleton,
  Stack,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { api } from "@quenti/trpc";
import { IconLogout, IconSettings, IconTrash } from "@tabler/icons-react";
import { useRouter } from "next/router";
import React from "react";
import { AnimatedCheckCircle } from "../../../components/animated-icons/check";
import { AutoResizeTextarea } from "../../../components/auto-resize-textarea";
import { ConfirmModal } from "../../../components/confirm-modal";
import { Toast } from "../../../components/toast";
import { useClass } from "../../../hooks/use-class";
import { SettingsWrapper } from "../../organizations/settings-wrapper";
import { ClassSections } from "../class-sections";
import { useProtectedRedirect } from "../use-protected-redirect";

export const ClassSettings = () => {
  const utils = api.useContext();
  const { data } = useClass();
  const router = useRouter();
  const toast = useToast();
  const isLoaded = useProtectedRedirect();

  const [mounted, setMounted] = React.useState(false);
  const [leaveOpen, setLeaveOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");

  React.useEffect(() => {
    if (data && !mounted) {
      setMounted(true);
      setName(data.name);
      setDescription(data.description);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const update = api.classes.update.useMutation({
    onSuccess: async () => {
      await utils.classes.get.invalidate();

      toast({
        title: "Class updated successfully",
        status: "success",
        colorScheme: "green",
        icon: <AnimatedCheckCircle />,
        render: Toast,
      });
    },
  });
  const deleteClass = api.classes.delete.useMutation({
    onSuccess: async () => {
      await router.push("/home");
      toast({
        title: "Class deleted",
        icon: <AnimatedCheckCircle />,
        render: Toast,
      });
    },
  });
  const removeMembers = api.classes.removeMembers.useMutation({
    onSuccess: async () => {
      await router.push("/home");
      toast({
        title: "Left class successfully",
        icon: <AnimatedCheckCircle />,
        render: Toast,
      });
    },
  });

  const inputBorder = useColorModeValue("gray.300", "gray.600");

  return (
    <>
      <ConfirmModal
        isOpen={leaveOpen}
        onClose={() => setLeaveOpen(false)}
        heading="Leave class"
        body="Are you sure you want to leave this class? You will not be able to access it again unless you are re-invited."
        isLoading={removeMembers.isLoading}
        onConfirm={() => {
          removeMembers.mutate({
            id: data!.id,
            members: [data!.me.id],
            type: "member",
          });
        }}
        actionText="Leave class"
        destructive
      />
      <ConfirmModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        heading="Delete class"
        body="Are you sure you want to delete this class? All members will be disbanded and all content will be deleted. This action cannot be undone."
        isLoading={deleteClass.isLoading}
        onConfirm={() => {
          deleteClass.mutate({ id: data!.id });
        }}
        actionText="Delete class"
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
          <ButtonGroup size={{ base: "sm", md: "md" }}>
            <Skeleton rounded="lg" isLoaded={isLoaded}>
              <Button
                variant="ghost"
                onClick={() => {
                  setName(data!.name);
                  setDescription(data!.description);
                }}
              >
                Reset
              </Button>
            </Skeleton>
            <Skeleton rounded="lg" isLoaded={isLoaded}>
              <Button
                isLoading={update.isLoading}
                onClick={() => {
                  update.mutate({
                    id: data!.id,
                    name,
                    description,
                  });
                }}
              >
                Save changes
              </Button>
            </Skeleton>
          </ButtonGroup>
        </Flex>
        <Divider borderColor={inputBorder} />
        <SettingsWrapper
          heading="General"
          description="Public class settings"
          isLoaded={isLoaded}
        >
          <Stack spacing="4" maxW="sm">
            <Stack spacing="1">
              <Skeleton rounded="md" w="full" isLoaded={isLoaded}>
                <Input
                  borderColor={inputBorder}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name"
                />
              </Skeleton>
            </Stack>
            <Stack spacing="1">
              <Skeleton rounded="md" w="full" isLoaded={isLoaded}>
                <AutoResizeTextarea
                  borderColor={inputBorder}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  allowTab={false}
                  placeholder="Description"
                />
              </Skeleton>
            </Stack>
          </Stack>
        </SettingsWrapper>
        <Divider borderColor={inputBorder} />
        <ClassSections />
        <Divider borderColor={inputBorder} />
        <SettingsWrapper
          heading="Danger zone"
          description="Actions in this area are irreversible"
          isLoaded={isLoaded}
        >
          <ButtonGroup spacing="2">
            {(data?.teachers?.length || 0) > 1 ? (
              <Button
                w="max"
                variant="outline"
                colorScheme="gray"
                leftIcon={<IconLogout size={18} />}
                onClick={() => setLeaveOpen(true)}
              >
                Leave class
              </Button>
            ) : undefined}
            <Skeleton rounded="lg" isLoaded={isLoaded} fitContent>
              <Button
                w="max"
                colorScheme="red"
                variant="outline"
                leftIcon={<IconTrash size={18} />}
                onClick={() => setDeleteOpen(true)}
              >
                Delete class
              </Button>
            </Skeleton>
          </ButtonGroup>
        </SettingsWrapper>
      </Stack>
    </>
  );
};
