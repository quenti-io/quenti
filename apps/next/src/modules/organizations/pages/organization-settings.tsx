import { useSession } from "next-auth/react";
import React from "react";

import { Link } from "@quenti/components";
import { ORG_SUPPORT_EMAIL } from "@quenti/lib/constants/email";
import type { MembershipRole } from "@quenti/prisma/client";
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
  chakra,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";

import {
  IconClock,
  IconFilterPlus,
  IconLogout,
  IconSettings,
  IconTrash,
  IconUpload,
  IconWorldCheck,
  IconWorldPlus,
} from "@tabler/icons-react";

import { AnimatedCheckCircle } from "../../../components/animated-icons/check";
import { SkeletonLabel } from "../../../components/skeleton-label";
import { Toast } from "../../../components/toast";
import { useOrganization } from "../../../hooks/use-organization";
import { rtf } from "../../../utils/time";
import { DeleteOrganizationModal } from "../delete-organization-modal";
import { DomainCard } from "../domain-card";
import { DomainFilterCard } from "../domain-filter-card";
import { DomainFilterModal } from "../domain-filter-modal";
import { LeaveOrganizationModal } from "../leave-organization-modal";
import { OrganizationAdminOnly } from "../organization-admin-only";
import { OrganizationLogo } from "../organization-logo";
import { RemoveDomainFilterModal } from "../remove-domain-filter-modal";
import { RemoveDomainModal } from "../remove-domain-modal";
import { SettingsWrapper } from "../settings-wrapper";
import { UpdateDomainModal } from "../update-domain-modal";
import { useOrgLogoUpload } from "../use-org-logo-upload";
import { getBaseDomain } from "../utils/get-base-domain";

export const OrganizationSettings = () => {
  const utils = api.useUtils();
  const { data: session } = useSession();

  const { data: org } = useOrganization();
  const base = getBaseDomain(org);
  const student = org?.domains.find((x) => x.type == "Student");

  const toast = useToast();
  const inputBg = useColorModeValue("white", "gray.900");
  const inputBorder = useColorModeValue("gray.200", "gray.600");
  const mutedColor = useColorModeValue("gray.600", "gray.400");
  const linkDefault = useColorModeValue("gray.700", "gray.300");
  const highlight = useColorModeValue("blue.500", "blue.200");

  const deletionScheduled = !!org?.deletedAt;

  const [mounted, setMounted] = React.useState(false);
  const [orgName, setOrgName] = React.useState("");
  const [leaveOpen, setLeaveOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [domainVerify, setDomainVerify] = React.useState(false);
  const [domainFilter, setDomainFilter] = React.useState(false);
  const [removeFilter, setRemoveFilter] = React.useState(false);
  const [updateDomainOpen, setUpdateDomainOpen] = React.useState(false);
  const [removeDomain, setRemoveDomain] = React.useState<
    { id: string; domain: string } | undefined
  >();

  const [imageSrc, setImageSrc] = React.useState<string | null | undefined>(
    undefined,
  );
  const imageLoaded = imageSrc !== undefined;

  const { file, onInputFile, uploadLogo } = useOrgLogoUpload({});
  React.useEffect(() => {
    if (file) setImageSrc(file as string);
  }, [file]);

  const update = api.organizations.update.useMutation({
    onSuccess: async () => {
      if (file && imageSrc !== null) {
        await uploadLogo.mutateAsync({ orgId: org!.id });
      }

      toast({
        title: "Organization updated successfully",
        status: "success",
        colorScheme: "green",
        icon: <AnimatedCheckCircle />,
        render: Toast,
      });

      await utils.organizations.get.invalidate();
    },
  });

  React.useEffect(() => {
    if (org && !mounted) {
      setMounted(true);
      setOrgName(org.name);
      setImageSrc(org.logoUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [org]);

  const role: MembershipRole = org
    ? org.members.find((x) => x.userId == session?.user?.id)!.role
    : "Member";

  const isOwner = role == "Owner";
  const isAdmin = role == "Admin" || isOwner;

  const isOnlyOwner =
    isOwner && org?.members.filter((x) => x.role == "Owner").length == 1;

  return (
    <Stack spacing="8" pb="20">
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
      <UpdateDomainModal
        isOpen={updateDomainOpen}
        onClose={() => {
          setUpdateDomainOpen(false);
        }}
        verify={domainVerify}
        onUpdate={() => {
          setDomainVerify(true);
        }}
      />
      <RemoveDomainModal
        isOpen={!!removeDomain}
        onClose={() => setRemoveDomain(undefined)}
        id={removeDomain?.id || ""}
        domain={removeDomain?.domain || ""}
      />
      <DomainFilterModal
        isOpen={domainFilter}
        onClose={() => setDomainFilter(false)}
        filter={base?.filter ?? undefined}
        update={!!base?.filter}
      />
      <RemoveDomainFilterModal
        isOpen={removeFilter}
        onClose={() => setRemoveFilter(false)}
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
          <ButtonGroup size={{ base: "sm", md: "md" }}>
            <Button
              variant="ghost"
              onClick={() => {
                setOrgName(org!.name);
                setImageSrc(org!.logoUrl);
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
                  clearLogo: imageSrc === null,
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
        <Stack spacing="5" pb="2px">
          <HStack spacing="4">
            <Skeleton rounded="full" isLoaded={imageLoaded}>
              <Box
                w="16"
                minW="16"
                h="16"
                rounded="full"
                overflow="hidden"
                shadow="lg"
              >
                <OrganizationLogo
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
                    maxW="xs"
                    color="gray.600"
                    _dark={{
                      color: "gray.400",
                    }}
                  >
                    We recommend using an image of at least 512x512 for the
                    organization.
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
                      isDisabled={!isAdmin}
                    >
                      Upload
                    </Button>
                  </label>
                </Skeleton>
                <Skeleton rounded="lg" isLoaded={imageLoaded}>
                  <Button
                    isDisabled={!org?.logoUrl && !file}
                    onClick={() => setImageSrc(null)}
                  >
                    Remove
                  </Button>
                </Skeleton>
              </ButtonGroup>
            </Stack>
          </HStack>
          <Stack spacing="1">
            <SkeletonLabel isLoaded={!!org}>Name</SkeletonLabel>
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
          </Stack>
          <Stack spacing="1">
            <SkeletonLabel isLoaded={!!org}>Domains</SkeletonLabel>
            <Stack spacing="3">
              {org?.domains.map((d) => (
                <DomainCard
                  key={d.id}
                  role={role}
                  {...d}
                  onRequestVerify={() => {
                    setDomainVerify(true);
                    setUpdateDomainOpen(true);
                  }}
                  onRequestUpdate={() => {
                    setDomainVerify(false);
                    setUpdateDomainOpen(true);
                  }}
                  onRequestRemove={() => {
                    setRemoveDomain({
                      id: d.id,
                      domain: d.requestedDomain,
                    });
                  }}
                />
              ))}
              {!!org && !org.domains.find((d) => d.type == "Student") && (
                <OrganizationAdminOnly>
                  <Button
                    w="max"
                    variant="ghost"
                    leftIcon={<IconWorldPlus size={18} />}
                    onClick={() => {
                      setUpdateDomainOpen(true);
                    }}
                  >
                    Add a student domain
                  </Button>
                </OrganizationAdminOnly>
              )}
              {!org && (
                <DomainCard
                  type="Base"
                  domain="placeholder"
                  requestedDomain="placeholder"
                  role="Member"
                  verifiedAt={null}
                />
              )}
            </Stack>
          </Stack>
        </Stack>
      </SettingsWrapper>
      <Divider />
      <SettingsWrapper
        heading="Domain filter"
        description="Use a domain filter to differentiate between students and teachers"
        noOfLines={2}
        isLoaded={!!org}
      >
        <Stack spacing="4">
          <SkeletonText isLoaded={!!org} noOfLines={2} skeletonHeight={5}>
            <Text color={mutedColor}>
              Need help or have a more difficult scenario? Feel free to reach
              out to us at{" "}
              <Link
                href={`mailto:${ORG_SUPPORT_EMAIL}`}
                color={linkDefault}
                fontWeight={600}
                transition="color 0.2s ease-in-out"
                _hover={{ color: highlight }}
              >
                {ORG_SUPPORT_EMAIL}
              </Link>
              .
            </Text>
          </SkeletonText>
          <Stack spacing="4">
            {!org && <DomainFilterCard filter="" active={false} skeleton />}
            {base?.filter && (
              <DomainFilterCard
                filter={base.filter}
                active={!!base.domain}
                onRequestUpdate={() => setDomainFilter(true)}
                onRequestRemove={() => setRemoveFilter(true)}
              />
            )}
            {student && (
              <HStack
                flexDir={{ base: "column", md: "row" }}
                alignItems={{ base: "start", md: "center" }}
              >
                <Box color="blue.300">
                  <IconWorldCheck size={18} />
                </Box>
                <Text>
                  Using student domain{" "}
                  <strong>{student.requestedDomain}</strong> to filter out
                  students
                </Text>
              </HStack>
            )}
            {base && !base.filter && !student && (
              <Button
                w="max"
                leftIcon={<IconFilterPlus size={18} />}
                variant="outline"
                colorScheme={student ? "gray" : "blue"}
                onClick={() => setDomainFilter(true)}
              >
                Add a domain filter
              </Button>
            )}
          </Stack>
        </Stack>
      </SettingsWrapper>
      <Divider />
      <SettingsWrapper
        heading="Danger zone"
        description="Actions in this area are irreversible"
        isLoaded={!!org}
      >
        <Stack spacing="6">
          <Skeleton isLoaded={!!org} rounded="md" fitContent>
            <ButtonGroup spacing="3">
              {!isOnlyOwner && (
                <Button
                  colorScheme="gray"
                  variant="outline"
                  leftIcon={<IconLogout size={18} />}
                  w="max"
                  onClick={() => setLeaveOpen(true)}
                >
                  Leave {org?.name || "Organization"}
                </Button>
              )}
              {isOwner && (
                <Button
                  isDisabled={deletionScheduled}
                  colorScheme="red"
                  variant="outline"
                  leftIcon={<IconTrash size={18} />}
                  w="max"
                  onClick={() => setDeleteOpen(true)}
                >
                  Delete {org?.name || "Organization"}
                </Button>
              )}
            </ButtonGroup>
          </Skeleton>
          {deletionScheduled && <DeletionNotice />}
        </Stack>
      </SettingsWrapper>
    </Stack>
  );
};

const DeletionNotice = () => {
  const { data: org } = useOrganization();
  const deletedAt = org!.deletedAt!;

  const deletionDate = new Date(deletedAt).getTime();
  const deletionPlus48Hours = deletionDate + 48 * 60 * 60 * 1000;
  const hoursToDeletion = Math.ceil(
    (deletionPlus48Hours - Date.now()) / (60 * 60 * 1000),
  );
  const formattedDeletion = rtf.format(hoursToDeletion, "hour");

  const linkDefault = useColorModeValue("gray.700", "gray.300");
  const highlight = useColorModeValue("blue.500", "blue.200");

  return (
    <Stack>
      <HStack
        color="red.600"
        _dark={{
          color: "red.200",
        }}
      >
        <IconClock size={18} />
        <Text fontWeight={600}>Scheduled for deletion</Text>
      </HStack>
      <Text color="gray.500">
        Your organization will be deleted{" "}
        <chakra.strong fontWeight={600} color={linkDefault}>
          {formattedDeletion}
        </chakra.strong>
        . If you believe this was a mistake, please{" "}
        <Link
          href={`mailto:${ORG_SUPPORT_EMAIL}`}
          color={linkDefault}
          fontWeight={600}
          transition="color 0.2s ease-in-out"
          _hover={{ color: highlight }}
        >
          contact us
        </Link>{" "}
        immediately.
      </Text>
    </Stack>
  );
};
