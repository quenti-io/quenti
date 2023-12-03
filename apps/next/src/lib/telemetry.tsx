import { JitsuContext, JitsuProvider } from "@jitsu/jitsu-react";
import { emptyAnalytics } from "@jitsu/js";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";

import { env } from "@quenti/env/client";
import type { StudySetVisibility } from "@quenti/prisma/client";

type SetCreated = {
  id: string;
  visibility: StudySetVisibility;
  title: string;
  terms: number;
};

type FolderCreated = {
  id: string;
};

type ClassCreated = {
  id: string;
  name: string;
};

type OrgCreated = {
  id: string;
  name: string;
};

type ImportCompleted = {
  setId: string;
  title: string;
  terms: number;
  origin: string;
  source: "quizlet";
  elapsed: number;
};

type None = Record<string, never>;

export type Events = {
  signup: None;
  login: None;
  onboarding_started: None;
  onboarding_completed: None;
  set_created: SetCreated;
  folder_created: FolderCreated;
  class_created: ClassCreated;
  org_created: OrgCreated;
  import_completed: ImportCompleted;
};

export const TELEMETRY_ENABLED =
  !!env.NEXT_PUBLIC_TELEMETRY_HOST && !!env.NEXT_PUBLIC_TELEMETRY_KEY;

export const TelemetryProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  if (!TELEMETRY_ENABLED) return <>{children}</>;

  return (
    <JitsuProvider
      options={{
        host: env.NEXT_PUBLIC_TELEMETRY_HOST || "",
        writeKey: env.NEXT_PUBLIC_TELEMETRY_KEY,
        disabled: !TELEMETRY_ENABLED,
      }}
    >
      {children}
    </JitsuProvider>
  );
};

const useJitsuInternal_ = () => {
  const instance = React.useContext(JitsuContext);

  if (!TELEMETRY_ENABLED) {
    return { analytics: emptyAnalytics };
  } else if (instance?.analytics) return instance;

  return { analytics: emptyAnalytics };
};

export const EventListeners = () => {
  return (
    <>
      <IdentifyUser />
      <TrackPageView />
    </>
  );
};

export const TrackPageView = () => {
  const router = useRouter();
  const { analytics } = useJitsuInternal_();

  React.useEffect(() => {
    void analytics.page({
      pathname: router.pathname,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.asPath]);

  return null;
};

export const IdentifyUser = () => {
  const { data: session } = useSession();
  const { analytics } = useJitsuInternal_();

  React.useEffect(() => {
    if (!TELEMETRY_ENABLED || !session?.user) return;
    void analytics.identify(session.user.id, {
      name: session.user.name,
      username: session.user.username,
      email: session.user.email!,
      flags: session.user.flags,
      organizationId: session.user.organizationId,
      banned: session.user.banned,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user]);

  return null;
};

export const useTelemetry = () => {
  const { analytics } = useJitsuInternal_();

  const event = async <T extends keyof Events>(name: T, data: Events[T]) => {
    if (!TELEMETRY_ENABLED) {
      console.log(`Local telemetry | ${name}:`, data);
      return;
    }
    await analytics.track(name, data);
  };

  return { event };
};
