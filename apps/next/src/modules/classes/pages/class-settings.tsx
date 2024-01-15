import { useRouter } from "next/router";
import React from "react";

import { api } from "@quenti/trpc";

import {
  Box,
  Button,
  ButtonGroup,
  Divider,
  Flex,
  HStack,
  Heading,
  Input,
  Skeleton,
  SkeletonText,
  Stack,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";

import {
  IconLogout,
  IconPaint,
  IconSettings,
  IconTrash,
  IconUpload,
} from "@tabler/icons-react";

import { AnimatedCheckCircle } from "../../../components/animated-icons/check";
import { AutoResizeTextarea } from "../../../components/auto-resize-textarea";
import { ConfirmModal } from "../../../components/confirm-modal";
import { Toast } from "../../../components/toast";
import { useClass } from "../../../hooks/use-class";
import { SettingsWrapper } from "../../organizations/settings-wrapper";
import { BannerPicker } from "../banner-picker";
import { ClassLogo } from "../class-logo";
import { ClassSections } from "../class-sections";
import { useClassLogoUpload } from "../use-class-logo-upload";
import { useProtectedRedirect } from "../use-protected-redirect";

export const ClassSettings = () => {
  const utils = api.useUtils();
  const { data } = useClass();
  const router = useRouter();
  const toast = useToast();
  const isLoaded = useProtectedRedirect();

  const [imageSrc, setImageSrc] = React.useState<string | null | undefined>(
    undefined,
  );
  const imageLoaded = imageSrc !== undefined;

  const { file, onInputFile, uploadLogo } = useClassLogoUpload({});
  React.useEffect(() => {
    if (file) setImageSrc(file as string);
  }, [file]);

  const [mounted, setMounted] = React.useState(false);
  const [leaveOpen, setLeaveOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [bannerColor, setBannerColor] = React.useState("");

  const [bannerPickerOpen, setBannerPickerOpen] = React.useState(false);

  React.useEffect(() => {
    if (data && !mounted) {
      setMounted(true);
      setName(data.name);
      setDescription(data.description);
      setBannerColor(data.bannerColor);
      setImageSrc(data.logoUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const update = api.classes.update.useMutation({
    onSuccess: async () => {
      if (file && imageSrc !== null) {
        await uploadLogo.mutateAsync({ classId: data!.id });
      }

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
          if (!data!.me.id) return;
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
                  setBannerColor(data!.bannerColor);
                  setImageSrc(data!.logoUrl);
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
                    bannerColor,
                    clearLogo: imageSrc === null,
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
          <Stack spacing="8" maxW="sm">
            <HStack spacing="4">
              <Skeleton rounded="xl" isLoaded={imageLoaded}>
                <Box
                  w="16"
                  minW="16"
                  h="16"
                  rounded="xl"
                  overflow="hidden"
                  shadow="lg"
                >
                  <ClassLogo
                    width={64}
                    height={64}
                    url={imageSrc}
                    local={!!file}
                  />
                </Box>
              </Skeleton>
              <Stack>
                <input
                  onInput={onInputFile}
                  style={{ position: "absolute", display: "none" }}
                  type="file"
                  id="upload-logo-input"
                  accept="image/*"
                />
                <Flex alignItems="center" height="42px">
                  <SkeletonText
                    fitContent
                    noOfLines={2}
                    skeletonHeight={3}
                    isLoaded={imageLoaded}
                  >
                    <Text
                      fontSize="sm"
                      color="gray.600"
                      _dark={{
                        color: "gray.400",
                      }}
                    >
                      We recommend using an image of at least 256x256 for the
                      class.
                    </Text>
                  </SkeletonText>
                </Flex>
                <ButtonGroup size="sm" colorScheme="gray" variant="outline">
                  <Skeleton rounded="lg" isLoaded={imageLoaded}>
                    <label htmlFor="upload-logo-input">
                      <Button
                        as="span"
                        leftIcon={<IconUpload size={16} />}
                        cursor="pointer"
                      >
                        Upload
                      </Button>
                    </label>
                  </Skeleton>
                  <Skeleton rounded="lg" isLoaded={imageLoaded}>
                    <Button
                      isDisabled={!data?.logoUrl && !file}
                      onClick={() => setImageSrc(null)}
                    >
                      Remove
                    </Button>
                  </Skeleton>
                </ButtonGroup>
              </Stack>
            </HStack>
            <Stack spacing="3">
              <Skeleton rounded="md" isLoaded={isLoaded} w="max">
                <HStack color="gray.500">
                  <IconPaint size={16} />
                  <Text fontSize="sm" fontWeight={500}>
                    Default banner color
                  </Text>
                </HStack>
              </Skeleton>
              <Skeleton rounded="md" isLoaded={isLoaded}>
                <BannerPicker
                  isOpen={bannerPickerOpen}
                  onClose={() => setBannerPickerOpen(false)}
                  selected={bannerColor}
                  onSelect={(c) => {
                    setBannerColor(c);
                    setBannerPickerOpen(false);
                  }}
                >
                  <Box
                    w="32"
                    h="16"
                    cursor="pointer"
                    rounded="lg"
                    bgGradient={`linear(to-tr, blue.300, ${bannerColor})`}
                    onClick={() => setBannerPickerOpen(true)}
                    shadow="sm"
                    position="relative"
                    role="group"
                    overflow="hidden"
                  >
                    <Box
                      position="absolute"
                      top="0"
                      left="0"
                      w="full"
                      h="full"
                      transition="opacity 0.15s ease-in-out"
                      opacity={0}
                      _hover={{
                        opacity: 0.2,
                      }}
                      bg="white"
                    />
                  </Box>
                </BannerPicker>
              </Skeleton>
            </Stack>
            <Stack spacing="4">
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
            {(data?.teachers?.length || 0) > 1 && data?.me.id ? (
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
