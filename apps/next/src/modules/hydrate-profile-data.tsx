import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";

import { type RouterOutputs, api } from "@quenti/trpc";

import { Loading } from "../components/loading";
import { useLoading } from "../hooks/use-loading";
import { Profile404 } from "./profile/profile-404";

type ProfileData = RouterOutputs["profile"]["get"] & { isMe: boolean };
export const ProfileContext = React.createContext<ProfileData>({
  id: "",
  username: "",
  image: "",
  verified: false,
  name: "",
  studySets: [],
  folders: [],
  isMe: false,
});

interface HydrateProfileDataProps {
  fallback?: React.ReactNode;
}

export const HydrateProfileData: React.FC<
  React.PropsWithChildren<HydrateProfileDataProps>
> = ({ children, fallback }) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const username = router.query.username as string;

  const queryKey = status == "authenticated" ? "get" : "getPublic";
  const profile = (api.profile[queryKey] as typeof api.profile.get).useQuery(
    { username: (username || "").substring(1) },
    {
      enabled: status !== "loading" && !!username,
    },
  );
  const { loading } = useLoading();

  if (profile.error?.data?.httpStatus === 404) return <Profile404 />;
  if (loading || !profile.data) return fallback ?? <Loading />;

  return (
    <ProfileContext.Provider
      value={{
        ...profile.data,
        isMe: profile.data.id === session?.user?.id,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};
