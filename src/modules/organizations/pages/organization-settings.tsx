import {
  Box,
  Button,
  ButtonGroup,
  Divider,
  Flex,
  HStack,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputLeftAddon,
  Skeleton,
  SkeletonText,
  Stack,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import type { MembershipRole } from "@prisma/client";
import { IconLogout, IconSettings, IconTrash } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import { AnimatedCheckCircle } from "../../../components/animated-icons/check";
import { AnimatedXCircle } from "../../../components/animated-icons/x";
import { getBaseDomain } from "../../../lib/urls";
import { api } from "../../../utils/api";
import { ORGANIZATION_ICONS } from "../../../utils/icons";
import { DeleteOrganizationModal } from "../delete-organization-modal";
import { LeaveOrganizationModal } from "../leave-organization-modal";
import { OrganizationAdminOnly } from "../organization-admin-only";
import { SettingsWrapper } from "../settings-wrapper";

export const OrganizationSettings = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const utils = api.useContext();
  const id = router.query.id as string;

  const { data: org } = api.organizations.get.useQuery(
    { id },
    {
      enabled: !!id && !!session?.user,
      retry: false,
    }
  );

  const toast = useToast();
  const inputBg = useColorModeValue("white", "gray.900");
  const inputBorder = useColorModeValue("gray.200", "gray.600");
  const addonBg = useColorModeValue("gray.100", "gray.750");
  const iconColor = useColorModeValue("#171923", "white");

  const [orgName, setOrgName] = React.useState("");
  const [orgSlug, setOrgSlug] = React.useState("");
  const [icon, setIcon] = React.useState<number | undefined>();
  const [leaveOpen, setLeaveOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);

  const update = api.organizations.update.useMutation({
    onSuccess: async () => {
      toast({
        title: "Organization updated successfully",
        status: "success",
        icon: <AnimatedCheckCircle />,
        containerStyle: { marginBottom: "2rem", marginTop: "-1rem" },
      });

      await utils.organizations.get.invalidate();
    },
    onError: (err) => {
      if (err.data?.code == "BAD_REQUEST") {
        toast({
          title: "That organization URL is already taken",
          status: "error",
          icon: <AnimatedXCircle />,
          containerStyle: { marginBottom: "2rem", marginTop: "-1rem" },
        });
      }
    },
  });

  React.useEffect(() => {
    if (org) {
      setOrgName(org.name);
      setOrgSlug(org.slug);
      setIcon(org.icon);
    }
  }, [org]);

  const role: MembershipRole = org
    ? org.members.find((x) => x.userId == session?.user?.id)!.role
    : "Member";

  const isOwner = role == "Owner";
  const isAdmin = role == "Admin" || isOwner;

  return (
    <Stack spacing="8">
      <LeaveOrganizationModal
        isOpen={leaveOpen}
        onClose={() => {
          setLeaveOpen(false);
        }}
      />
      <DeleteOrganizationModal
        isOpen={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
        }}
      />
      <Flex justifyContent="space-between" alignItems="center" h="40px">
        <HStack spacing="3">
          <Skeleton rounded="full" isLoaded={!!org}>
            <IconSettings />
          </Skeleton>
          <Flex alignItems="center" h="9">
            <SkeletonText
              isLoaded={!!org}
              fitContent
              noOfLines={1}
              skeletonHeight="8"
            >
              <Heading size="lg">Settings</Heading>
            </SkeletonText>
          </Flex>
        </HStack>
        <OrganizationAdminOnly>
          <ButtonGroup>
            <Button
              variant="ghost"
              onClick={() => {
                setOrgName(org!.name);
                setOrgSlug(org!.slug);
                setIcon(org!.icon);
              }}
            >
              Reset
            </Button>
            <Button
              isLoading={update.isLoading}
              onClick={() => {
                update.mutate({
                  id: org!.id,
                  name: orgName,
                  slug: orgSlug,
                  icon: icon || 0,
                });
              }}
            >
              Save changes
            </Button>
          </ButtonGroup>
        </OrganizationAdminOnly>
      </Flex>
      <Divider />
      <SettingsWrapper
        heading="General"
        description="Global organization settings"
        isLoaded={!!org}
      >
        <Stack spacing="3" pb="2px">
          <Skeleton rounded="md" w="full" isLoaded={!!org}>
            <Input
              bg={inputBg}
              borderColor={inputBorder}
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              shadow="sm"
              isDisabled={!isAdmin}
            />
          </Skeleton>
          <Skeleton rounded="md" w="full" isLoaded={!!org}>
            <InputGroup borderColor={inputBorder} shadow="sm">
              <InputLeftAddon bg={addonBg} color="gray.500">
                {getBaseDomain()}/orgs/
              </InputLeftAddon>
              <Input
                value={orgSlug}
                bg={inputBg}
                onChange={(e) => setOrgSlug(e.target.value)}
                isDisabled={!isAdmin}
              />
            </InputGroup>
          </Skeleton>
        </Stack>
      </SettingsWrapper>
      <Divider />
      <SettingsWrapper
        heading="Organization Icon"
        description="Choose an icon for your organization"
        isLoaded={!!org}
      >
        <Box ml="-4px" mt="-4px">
          {ORGANIZATION_ICONS.map((Icon, i) => (
            <Box display="inline-block" p="1" key={i}>
              <Skeleton rounded="md" isLoaded={!!org}>
                <IconButton
                  w="max"
                  variant={icon == i ? "solid" : "ghost"}
                  aria-label="Icon"
                  onClick={() => setIcon(i)}
                  isDisabled={!isAdmin}
                  icon={
                    <Icon
                      size={18}
                      style={{ transition: "all 300ms" }}
                      color={icon == i ? "white" : iconColor}
                    />
                  }
                />
              </Skeleton>
            </Box>
          ))}
        </Box>
      </SettingsWrapper>
      <Divider />
      <SettingsWrapper
        heading="Danger Zone"
        description="Actions in this area are irreversible"
        isLoaded={!!org}
      >
        <Skeleton isLoaded={!!org} rounded="md" fitContent>
          <Button
            colorScheme="red"
            variant="outline"
            leftIcon={
              isOwner ? <IconTrash size={18} /> : <IconLogout size={18} />
            }
            w="max"
            onClick={() => (isOwner ? setDeleteOpen(true) : setLeaveOpen(true))}
          >
            {isOwner ? "Delete" : "Leave"} {org?.name || "Organization"}
          </Button>
        </Skeleton>
      </SettingsWrapper>
    </Stack>
  );
};
