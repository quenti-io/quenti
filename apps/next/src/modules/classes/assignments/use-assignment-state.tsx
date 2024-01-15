import type { Widen } from "@quenti/lib/widen";

import type { useAssignment } from "../../../hooks/use-assignment";
import type { useSet } from "../../../hooks/use-set";

export type AssignmentState = ReturnType<typeof useAssignmentState>;

export const useAssignmentState = ({
  assignment,
  isTeacher,
}: {
  assignment?: Widen<
    | ReturnType<typeof useAssignment>["data"]
    | ReturnType<typeof useSet>["assignment"]
  >;
  isTeacher?: boolean;
}) => {
  if (isTeacher) return "manage";
  if (!assignment) return "loading";

  const locked = !!assignment.lockedAt && assignment.lockedAt <= new Date();
  const submitted = !!assignment.submission?.submittedAt;
  const started = !!assignment.submission?.startedAt;

  if (locked) {
    if (submitted) return "submitted";
    return "locked";
  }

  if (submitted) return "submitted";
  if (started) return "continue";

  return "start";
};
