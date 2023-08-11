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
import { IconSettings, IconTrash } from "@tabler/icons-react";
import { useRouter } from "next/router";
import React from "react";
import { AnimatedCheckCircle } from "../../../components/animated-icons/check";
import { AutoResizeTextarea } from "../../../components/auto-resize-textarea";
import { ConfirmModal } from "../../../components/confirm-modal";
import { useClass } from "../../../hooks/use-class";
import { SettingsWrapper } from "../../organizations/settings-wrapper";

export const ClassSettings = () => {
  const utils = api.useContext();
  const { data } = useClass();
  const router = useRouter();
  const toast = useToast();

  const [mounted, setMounted] = React.useState(false);
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
        icon: <AnimatedCheckCircle />,
        containerStyle: { marginBottom: "2rem", marginTop: "-1rem" },
      });
    },
  });
  const deleteClass = api.classes.delete.useMutation({
    onSuccess: async () => {
      await router.push("/home");
      toast({
        title: "Class deleted",
        icon: <AnimatedCheckCircle />,
        containerStyle: { marginBottom: "2rem", marginTop: "-1rem" },
      });
    },
  });

  const inputBorder = useColorModeValue("gray.300", "gray.600");

  return (
    <>
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
          <Skeleton rounded="md" isLoaded={!!data}>
            <HStack>
              <IconSettings />
              <Heading size="lg">Settings</Heading>
            </HStack>
          </Skeleton>
          <ButtonGroup>
            <Skeleton rounded="md" isLoaded={!!data}>
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
            <Skeleton rounded="md" isLoaded={!!data}>
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
        <Divider />
        <SettingsWrapper
          heading="General"
          description="Public class settings"
          isLoaded={!!data}
        >
          <Stack spacing="4" maxW="sm">
            <Stack spacing="1">
              <Skeleton rounded="md" w="full" isLoaded={!!data}>
                <Input
                  borderColor={inputBorder}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name"
                />
              </Skeleton>
            </Stack>
            <Stack spacing="1">
              <Skeleton rounded="md" w="full" isLoaded={!!data}>
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
        <Divider />
        <SettingsWrapper
          heading="Danger zone"
          description="Actions in this area are irreversible"
          isLoaded={!!data}
        >
          <Skeleton rounded="md" isLoaded={!!data} fitContent>
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
        </SettingsWrapper>
      </Stack>
    </>
  );
};
