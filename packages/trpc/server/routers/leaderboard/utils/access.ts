import type { StudySet } from "@quenti/prisma/client";

import { TRPCError } from "@trpc/server";

type LimitedStudySet = Pick<StudySet, "userId" | "visibility">;

export const validateLeaderboardAccess = (
  leaderboard: {
    studySet: LimitedStudySet | null;
    folder: {
      userId: string;
      studySets: { studySet: LimitedStudySet }[];
    } | null;
  },
  userId: string,
) => {
  if (
    leaderboard.studySet &&
    leaderboard.studySet.visibility === "Private" &&
    leaderboard.studySet.userId !== userId
  ) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "This set is private.",
    });
  } else if (leaderboard.folder && leaderboard.folder.userId !== userId) {
    // Check if the user has access to at least one set in the folder
    const studySets = leaderboard.folder.studySets.map((x) => x.studySet);
    for (const s of studySets) {
      if (s.visibility == "Public" || s.userId == userId) return;
    }

    throw new TRPCError({
      code: "FORBIDDEN",
      message: "You do not have access to this folder.",
    });
  }
};
