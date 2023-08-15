import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import { api } from "@quenti/trpc";

import { IconSwitchHorizontal } from "@tabler/icons-react";

import type { MenuOption } from "../components/command-menu";

export const useDevActions = (): MenuOption[] => {
  const router = useRouter();
  const { data: session } = useSession();
  const type = session?.user?.type;
  const options: MenuOption[] = [];

  const setAccountType = api.dev.setAccountType.useMutation();

  options.push({
    name: `Switch to ${type === "Teacher" ? "Student" : "Teacher"} Account`,
    label: "Switch account type",
    icon: <IconSwitchHorizontal />,
    action: () => {
      setAccountType.mutate(type === "Teacher" ? "Student" : "Teacher");
      router.reload();
    },
  });

  return options;
};
