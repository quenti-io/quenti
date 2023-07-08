import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export const UserType = {
  Student: "Student",
  Teacher: "Teacher",
} as const;
export type UserType = (typeof UserType)[keyof typeof UserType];
export const MembershipRole = {
  Member: "Member",
  Admin: "Admin",
  Owner: "Owner",
} as const;
export type MembershipRole =
  (typeof MembershipRole)[keyof typeof MembershipRole];
export const StudySetVisibility = {
  Private: "Private",
  Unlisted: "Unlisted",
  Public: "Public",
} as const;
export type StudySetVisibility =
  (typeof StudySetVisibility)[keyof typeof StudySetVisibility];
export const EntityType = {
  StudySet: "StudySet",
  Folder: "Folder",
} as const;
export type EntityType = (typeof EntityType)[keyof typeof EntityType];
export const StudiableMode = {
  Flashcards: "Flashcards",
  Learn: "Learn",
} as const;
export type StudiableMode = (typeof StudiableMode)[keyof typeof StudiableMode];
export const LearnMode = {
  Learn: "Learn",
  Review: "Review",
} as const;
export type LearnMode = (typeof LearnMode)[keyof typeof LearnMode];
export const LeaderboardType = {
  Match: "Match",
} as const;
export type LeaderboardType =
  (typeof LeaderboardType)[keyof typeof LeaderboardType];
export const StudySetAnswerMode = {
  Word: "Word",
  Definition: "Definition",
  Both: "Both",
} as const;
export type StudySetAnswerMode =
  (typeof StudySetAnswerMode)[keyof typeof StudySetAnswerMode];
export const LimitedStudySetAnswerMode = {
  Word: "Word",
  Definition: "Definition",
} as const;
export type LimitedStudySetAnswerMode =
  (typeof LimitedStudySetAnswerMode)[keyof typeof LimitedStudySetAnswerMode];
export const MultipleAnswerMode = {
  One: "One",
  All: "All",
  Unknown: "Unknown",
} as const;
export type MultipleAnswerMode =
  (typeof MultipleAnswerMode)[keyof typeof MultipleAnswerMode];
export const ContainerType = {
  StudySet: "StudySet",
  Folder: "Folder",
} as const;
export type ContainerType = (typeof ContainerType)[keyof typeof ContainerType];
export type Account = {
  id: string;
  userId: string;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token: string | null;
  access_token: string | null;
  expires_at: number | null;
  token_type: string | null;
  scope: string | null;
  id_token: string | null;
  session_state: string | null;
};
export type AllowedEmailRegex = {
  regex: string;
  label: string;
  createdAt: Generated<Timestamp>;
};
export type AutoSaveTerm = {
  id: string;
  word: string;
  definition: string;
  rank: number;
  setAutoSaveId: string;
};
export type Container = {
  id: string;
  entityId: string;
  type: ContainerType;
  userId: string;
  viewedAt: Timestamp;
  shuffleFlashcards: Generated<number>;
  learnRound: Generated<number>;
  learnMode: Generated<LearnMode>;
  shuffleLearn: Generated<number>;
  studyStarred: Generated<number>;
  answerWith: Generated<StudySetAnswerMode>;
  multipleAnswerMode: Generated<MultipleAnswerMode>;
  extendedFeedbackBank: Generated<number>;
  enableCardsSorting: Generated<number>;
  cardsRound: Generated<number>;
  cardsStudyStarred: Generated<number>;
  cardsAnswerWith: Generated<LimitedStudySetAnswerMode>;
  matchStudyStarred: Generated<number>;
};
export type EntityShare = {
  id: string;
  entityId: string;
  type: EntityType;
};
export type Folder = {
  id: string;
  createdAt: Generated<Timestamp>;
  userId: string;
  title: string;
  slug: string | null;
  description: string;
};
export type Highscore = {
  leaderboardId: string;
  userId: string;
  time: number;
  timestamp: Timestamp;
  eligible: Generated<number>;
};
export type Leaderboard = {
  id: string;
  entityId: string;
  type: LeaderboardType;
};
export type Membership = {
  id: string;
  orgId: string;
  userId: string;
  accepted: Generated<number>;
  role: MembershipRole;
};
export type Organization = {
  id: string;
  name: string;
  slug: string;
  createdAt: Generated<Timestamp>;
  icon: Generated<number>;
};
export type RecentFailedLogin = {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  createdAt: Generated<Timestamp>;
};
export type Session = {
  id: string;
  sessionToken: string;
  userId: string;
  expires: Timestamp;
};
export type SetAutoSave = {
  userId: string;
  savedAt: Timestamp;
  title: string;
  description: string;
  tags: Generated<unknown>;
  visibility: Generated<StudySetVisibility>;
  wordLanguage: Generated<string>;
  definitionLanguage: Generated<string>;
};
export type StarredTerm = {
  userId: string;
  termId: string;
  containerId: string;
};
export type StudiableTerm = {
  userId: string;
  termId: string;
  containerId: string;
  mode: Generated<StudiableMode>;
  correctness: number;
  appearedInRound: number | null;
  incorrectCount: Generated<number>;
  studiableRank: number | null;
};
export type StudySet = {
  id: string;
  userId: string;
  createdAt: Generated<Timestamp>;
  savedAt: Generated<Timestamp>;
  title: string;
  description: string;
  tags: Generated<unknown>;
  visibility: Generated<StudySetVisibility>;
  wordLanguage: Generated<string>;
  definitionLanguage: Generated<string>;
};
export type StudySetsOnFolders = {
  studySetId: string;
  folderId: string;
};
export type Term = {
  id: string;
  word: string;
  definition: string;
  rank: number;
  studySetId: string;
};
export type User = {
  id: string;
  name: string | null;
  username: string;
  email: string | null;
  emailVerified: Timestamp | null;
  image: string | null;
  type: Generated<UserType>;
  verified: Generated<number>;
  createdAt: Generated<Timestamp>;
  lastSeenAt: Generated<Timestamp>;
  bannedAt: Timestamp | null;
  displayName: Generated<number>;
  flags: Generated<number>;
  enableUsageData: Generated<number>;
  changelogVersion: string;
  organizationId: string | null;
};
export type VerificationToken = {
  identifier: string;
  token: string;
  expires: Timestamp;
};
export type WhitelistedEmail = {
  email: string;
  createdAt: Generated<Timestamp>;
};
export type DB = {
  Account: Account;
  AllowedEmailRegex: AllowedEmailRegex;
  AutoSaveTerm: AutoSaveTerm;
  Container: Container;
  EntityShare: EntityShare;
  Folder: Folder;
  Highscore: Highscore;
  Leaderboard: Leaderboard;
  Membership: Membership;
  Organization: Organization;
  RecentFailedLogin: RecentFailedLogin;
  Session: Session;
  SetAutoSave: SetAutoSave;
  StarredTerm: StarredTerm;
  StudiableTerm: StudiableTerm;
  StudySet: StudySet;
  StudySetsOnFolders: StudySetsOnFolders;
  Term: Term;
  User: User;
  VerificationToken: VerificationToken;
  WhitelistedEmail: WhitelistedEmail;
};
