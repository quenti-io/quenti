import { api } from "@quenti/trpc";

export const useMe = () => {
  return api.user.me.useQuery(undefined, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};
