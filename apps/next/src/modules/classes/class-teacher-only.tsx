import { useIsClassTeacher } from "../../hooks/use-is-class-teacher";

export const ClassTeacherOnly: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const isTeacher = useIsClassTeacher();
  if (!isTeacher) return null;

  return <>{children}</>;
};
