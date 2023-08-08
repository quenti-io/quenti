import { api } from "@quenti/trpc";

export const useMe = () => {
  return api.user.me.useQuery(undefined, {
    retry: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};
