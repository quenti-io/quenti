import {
  Box,
  Button,
  ButtonGroup,
  Divider,
  IconButton,
  Input,
  InputGroup,
  InputLeftAddon,
  Skeleton,
  Stack,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { AnimatedCheckCircle } from "../../../components/animated-icons/check";
import { AnimatedXCircle } from "../../../components/animated-icons/x";
import { getBaseDomain } from "../../../lib/urls";
import { SettingsWrapper } from "../settings-wrapper";
import { api } from "../../../utils/api";
import { ORGANIZATION_ICONS } from "../../../utils/icons";

export const OrganizationPage = () => {
  const router = useRouter();
  const utils = api.useContext();
  const slug = router.query.slug as string;

  const toast = useToast();
  const inputBorder = useColorModeValue("gray.400", "gray.600");
  const addonBg = useColorModeValue("gray.100", "gray.750");
  const iconColor = useColorModeValue("#171923", "white");

  const [orgName, setOrgName] = React.useState("");
  const [orgSlug, setOrgSlug] = React.useState("");
  const [icon, setIcon] = React.useState<number | undefined>();

  const { data: org } = api.organizations.get.useQuery(slug, {
    enabled: !!slug,
  });
  const update = api.organizations.update.useMutation({
    onSuccess: async (data) => {
      toast({
        title: "Organization updated successfully",
        status: "success",
        icon: <AnimatedCheckCircle />,
        containerStyle: { marginBottom: "2rem", marginTop: "-1rem" },
      });

      if (data.slug == slug) {
        await utils.organizations.get.invalidate();
      } else {
        await router.push(`/orgs/${data.slug}`);
      }
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

  return (
    <Stack spacing="5">
      <SettingsWrapper
        heading="General"
        description="Global organization settings"
        isLoaded={!!org}
      >
        <Stack spacing="3" pb="2px">
          <Skeleton rounded="md" w="full" isLoaded={!!org}>
            <Input
              borderColor={inputBorder}
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
            />
          </Skeleton>
          <Skeleton rounded="md" w="full" isLoaded={!!org}>
            <InputGroup borderColor={inputBorder}>
              <InputLeftAddon bg={addonBg} color="gray.500">
                {getBaseDomain()}/orgs/
              </InputLeftAddon>
              <Input
                value={orgSlug}
                onChange={(e) => setOrgSlug(e.target.value)}
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
      <ButtonGroup mt="6">
        <Skeleton rounded="md" isLoaded={!!org}>
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
        </Skeleton>
        <Skeleton rounded="md" isLoaded={!!org}>
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
            Save Changes
          </Button>
        </Skeleton>
      </ButtonGroup>
    </Stack>
  );
};
