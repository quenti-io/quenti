import { useSession } from "next-auth/react";

export const useIsTeacher = () => {
  const { data: session } = useSession();
  return session?.user?.type === "Teacher";
};
