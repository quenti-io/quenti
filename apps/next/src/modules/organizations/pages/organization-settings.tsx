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
  Skeleton,
  SkeletonText,
  Stack,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { ORG_SUPPORT_EMAIL } from "@quenti/lib/constants/email";
import type { MembershipRole } from "@quenti/prisma/client";
import { api } from "@quenti/trpc";
import {
  IconFilterPlus,
  IconLogout,
  IconSettings,
  IconTrash,
  IconWorldCheck,
  IconWorldPlus,
} from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import React from "react";
import { AnimatedCheckCircle } from "../../../components/animated-icons/check";
import { Link } from "../../../components/link";
import { SkeletonLabel } from "../../../components/skeleton-label";
import { useOrganization } from "../../../hooks/use-organization";
import { ORGANIZATION_ICONS } from "../../../utils/icons";
import { DeleteOrganizationModal } from "../delete-organization-modal";
import { DomainCard } from "../domain-card";
import { DomainFilterCard } from "../domain-filter-card";
import { DomainFilterModal } from "../domain-filter-modal";
import { LeaveOrganizationModal } from "../leave-organization-modal";
import { OrganizationAdminOnly } from "../organization-admin-only";
import { RemoveDomainFilterModal } from "../remove-domain-filter-modal";
import { RemoveDomainModal } from "../remove-domain-modal";
import { SettingsWrapper } from "../settings-wrapper";
import { UpdateDomainModal } from "../update-domain-modal";
import { getBaseDomain } from "../utils/get-base-domain";

export const OrganizationSettings = () => {
  const utils = api.useContext();
  const { data: session } = useSession();

  const { data: org } = useOrganization();
  const base = getBaseDomain(org);
  const student = org?.domains.find((x) => x.type == "Student");

  const toast = useToast();
  const inputBg = useColorModeValue("white", "gray.900");
  const inputBorder = useColorModeValue("gray.200", "gray.600");
  const iconColor = useColorModeValue("#171923", "white");
  const mutedColor = useColorModeValue("gray.600", "gray.400");
  const linkDefault = useColorModeValue("gray.700", "gray.300");
  const highlight = useColorModeValue("blue.500", "blue.200");

  const [mounted, setMounted] = React.useState(false);
  const [orgName, setOrgName] = React.useState("");
  const [icon, setIcon] = React.useState<number | undefined>();
  const [leaveOpen, setLeaveOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [domainVerify, setDomainVerify] = React.useState(false);
  const [domainFilter, setDomainFilter] = React.useState(false);
  const [removeFilter, setRemoveFilter] = React.useState(false);
  const [updateDomainOpen, setUpdateDomainOpen] = React.useState(false);
  const [removeDomain, setRemoveDomain] = React.useState<
    { id: string; domain: string } | undefined
  >();

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
  });

  React.useEffect(() => {
    if (org && !mounted) {
      setMounted(true);
      setOrgName(org.name);
      setIcon(org.icon);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          <ButtonGroup>
            <Button
              variant="ghost"
              onClick={() => {
                setOrgName(org!.name);
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
        <Stack spacing="5" pb="2px">
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
            <SkeletonLabel isLoaded={!!org}>Icon</SkeletonLabel>
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
              <HStack>
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
