import { useSession } from "next-auth/react";

export const TeacherOnly: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { data: session } = useSession();
  const isTeacher = session?.user?.type == "Teacher";

  if (isTeacher) return <>{children}</>;
  return null;
};
