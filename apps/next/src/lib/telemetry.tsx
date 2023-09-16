import { JitsuContext, JitsuProvider, createClient } from "@jitsu/nextjs";
import { type EventPayload, type UserProps } from "@jitsu/sdk-js";
import { useSession } from "next-auth/react";
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

export const jitsuClient = TELEMETRY_ENABLED
  ? createClient({
      tracking_host: env.NEXT_PUBLIC_TELEMETRY_HOST!,
      key: env.NEXT_PUBLIC_TELEMETRY_KEY!,
    })
  : null;

export const TelemtryProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  if (!jitsuClient) return <>{children}</>;

  return <JitsuProvider client={jitsuClient}>{children}</JitsuProvider>;
};

export const IdentifyUser = () => {
  if (!jitsuClient) return null;
  return <InnerIdentify />;
};

const InnerIdentify = () => {
  const { id } = useJitsuInternal_();
  const { data: session } = useSession();

  React.useEffect(() => {
    if (!session?.user) return;
    void id({
      id: session.user.id,
      email: session.user.email!,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user]);

  return null;
};

const useJitsuInternal_ = () => {
  const client = React.useContext(JitsuContext);

  const id = React.useCallback(
    (userData: UserProps, doNotSendEvent?: boolean): Promise<void> =>
      client?.id(userData, doNotSendEvent),
    [client],
  );

  const track = React.useCallback(
    (typeName: string, payload?: EventPayload): Promise<void> =>
      client?.track(typeName, payload),
    [client],
  );

  return { id, track };
};

export const useTelemetry = () => {
  const { id, track } = useJitsuInternal_();

  const event = async <T extends keyof Events>(name: T, data: Events[T]) => {
    if (!TELEMETRY_ENABLED) {
      console.log(`Local telemetry | ${name}:`, data);
      return;
    }
    await track(name, data);
  };

  return { id, event };
};
