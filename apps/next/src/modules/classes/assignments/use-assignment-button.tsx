import type { Widen } from "@quenti/lib/widen";

import { IconCircleCheck, IconLock } from "@tabler/icons-react";

import {
  type AssignmentState,
  useAssignmentState,
} from "./use-assignment-state";

export const useAssignmentButton = ({
  assignment,
  isTeacher,
  short = false,
}: Parameters<typeof useAssignmentState>[0] & { short?: boolean }) => {
  const _state = useAssignmentState({
    assignment,
    isTeacher,
  });

  const getState = () => {
    switch (_state) {
      case "start":
        return {
          label: "Start assignment",
        };
      case "continue":
        return {
          label: short ? "Continue" : "Continue assignment",
        };
      case "submitted":
        return {
          label: "Submitted",
          variant: "outline",
          Icon: IconCircleCheck,
        };
      case "locked":
        return {
          label: "Locked",
          variant: "outline",
          Icon: IconLock,
          colorScheme: "gray",
          isDisabled: true,
        };
      case "manage":
        return {
          label: "Manage assignment",
        };
      default: {
        const _exhaustiveCheck = _state as never;
        return _exhaustiveCheck;
      }
    }
  };

  return {
    ...(getState() as Widen<ReturnType<typeof getState>>),
    state: _state as AssignmentState,
  };
};
