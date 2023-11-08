import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";

import { api } from "@quenti/trpc";

import { useToast } from "@chakra-ui/react";

import { PageWrapper } from "../../common/page-wrapper";
import { AnimatedXCircle } from "../../components/animated-icons/x";
import { Loading } from "../../components/loading";
import { Toast } from "../../components/toast";
import { useMe } from "../../hooks/use-me";
import { useUnauthedRedirect } from "../../hooks/use-unauthed-redirect";
import { getLayout } from "../../layouts/main-layout";
import { OrganizationInviteScreen } from "../../modules/organizations/organization-invite-screen";
import { ReauthMessage } from "../../modules/organizations/reauth-message";

export default function Organizations() {
  const utils = api.useUtils();
  const session = useSession();
  const router = useRouter();
  const toast = useToast();
  const { data: me, isFetching } = useMe();

  useUnauthedRedirect();

  const [tokenChecked, setTokenChecked] = React.useState(false);
  const [outsideDomainError, setOutsideDomainError] = React.useState(false);

  const acceptToken = api.organizations.acceptToken.useMutation({
    onSuccess: async () => {
      await utils.user.me.invalidate();
      setTokenChecked(true);
    },
    onError: (e) => {
      setOutsideDomainError(e.message == "user_not_in_domain");
      setTokenChecked(true);
    },
  });

  const invalidateUser = async () => {
    await session.update();
    await utils.user.me.invalidate();
  };

  const setUserType = api.user.setUserType.useMutation({
    onSuccess: async () => {
      await invalidateUser();
    },
    onError: async () => {
      toast({
        title: "You don't have access to this organization",
        status: "error",
        icon: <AnimatedXCircle />,
        colorScheme: "red",
        render: Toast,
      });

      await router.push("/home");
    },
  });

  React.useEffect(() => {
    if (!router.isReady || !session.data?.user || !me || me?.orgMembership)
      return;

    if (router.query.token) {
      if (session.data.user.type == "Student")
        setUserType.mutate({
          type: "Teacher",
        });

      acceptToken.mutate({ token: router.query.token as string });
    } else setTokenChecked(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.data?.user, me, router.isReady]);

  React.useEffect(() => {
    if (!me?.orgMembership) return;
    void router.push(`/orgs/${me.orgMembership.organization.id}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [me?.orgMembership]);

  const isLoading =
    !session?.data?.user ||
    !me ||
    me.orgMembership ||
    isFetching ||
    !tokenChecked;

  const hasInvite = !!me?.orgInvites.length;

  React.useEffect(() => {
    if (isLoading || hasInvite || outsideDomainError) return;
    void router.push("/orgs/new");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, hasInvite, outsideDomainError]);

  if (outsideDomainError)
    return (
      <ReauthMessage
        title="You can't join this organization"
        message="Sign in with your organization's school/work email to proceed."
      />
    );
  if (hasInvite) return <OrganizationInviteScreen />;
  return <Loading />;
}

Organizations.PageWrapper = PageWrapper;
Organizations.getLayout = getLayout;
