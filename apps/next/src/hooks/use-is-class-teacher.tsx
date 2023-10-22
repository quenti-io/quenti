import { useClass } from "./use-class";

export const useIsClassTeacher = () => {
  const { data } = useClass();
  return data?.me?.type === "Teacher";
};
