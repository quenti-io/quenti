import { useRouter } from "next/router";
import React from "react";

import { type RouterOutputs, api } from "@quenti/trpc";

import { Loading } from "../components/loading";
import { useLoading } from "../hooks/use-loading";

type LandingData = RouterOutputs["admin"]["landing"] &
  RouterOutputs["admin"]["getUsers"];

export const AdminContext = React.createContext<LandingData>({
  users: [],
  containers: 0,
  folders: 0,
  studySets: 0,
  terms: 0,
  studiableTerms: 0,
  starredTerms: 0,
  grafanaUrl: undefined,
});

export const HydrateAdmin: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const router = useRouter();

  const { data } = api.admin.landing.useQuery(undefined, {
    onError: (error) => {
      void (async () => {
        if (error.data?.httpStatus == 403) {
          await router.push("/home");
        }
      })();
    },
  });
  const { data: userData } = api.admin.getUsers.useQuery();

  const { loading } = useLoading();

  if (loading || !data) return <Loading />;

  return (
    <AdminContext.Provider value={{ ...data, users: userData?.users || [] }}>
      {children}
    </AdminContext.Provider>
  );
};
