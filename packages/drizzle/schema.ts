import { relations } from "drizzle-orm";
import {
  boolean,
  datetime,
  index,
  mysqlEnum,
  mysqlTable,
  primaryKey,
  unique,
  varchar,
} from "drizzle-orm/mysql-core";

export const entityShare = mysqlTable(
  "EntityShare",
  {
    id: varchar("id", { length: 191 }).notNull(),
    entityId: varchar("entityId", { length: 191 }).notNull(),
    type: mysqlEnum("type", ["StudySet", "Folder"]).notNull(),
  },
  (table) => {
    return {
      entityShareIdPk: primaryKey({
        columns: [table.id],
        name: "EntityShare_id_pk",
      }),
      entityShareEntityIdKey: unique("EntityShare_entityId_key").on(
        table.entityId,
      ),
    };
  },
);

export const classJoinCode = mysqlTable(
  "ClassJoinCode",
  {
    id: varchar("id", { length: 191 }).notNull(),
    classId: varchar("classId", { length: 191 }).notNull(),
    sectionId: varchar("sectionId", { length: 191 }).notNull(),
    code: varchar("code", { length: 191 }).notNull(),
  },
  (table) => {
    return {
      classJoinCodeIdPk: primaryKey({
        columns: [table.id],
        name: "ClassJoinCode_id_pk",
      }),
      classJoinCodeSectionIdKey: unique("ClassJoinCode_sectionId_key").on(
        table.sectionId,
      ),
      classJoinCodeCodeKey: unique("ClassJoinCode_code_key").on(table.code),
      classJoinCodeClassIdIdx: index("ClassJoinCode_classId_idx").on(
        table.classId,
      ),
    };
  },
);

export const classJoinCodeRelations = relations(classJoinCode, ({ one }) => ({
  class: one(class_, {
    fields: [classJoinCode.classId],
    references: [class_.id],
  }),
}));

export const class_ = mysqlTable(
  "Class",
  {
    id: varchar("id", { length: 191 }).notNull(),
    orgId: varchar("orgId", { length: 191 }),
    name: varchar("name", { length: 191 }).notNull(),
    description: varchar("description", { length: 191 }).notNull(),
    logoUrl: varchar("logoUrl", { length: 191 }),
    logoHash: varchar("logoHash", { length: 191 }),
    bannerColor: varchar("bannerColor", { length: 191 }).notNull(),
    bannerUrl: varchar("bannerUrl", { length: 191 }),
    bannerHash: varchar("bannerHash", { length: 191 }),
  },
  (table) => {
    return {
      classIdPk: primaryKey({
        columns: [table.id],
        name: "Class_id_pk",
      }),
      orgIdIdx: index("Class_orgId_idx").on(table.orgId),
    };
  },
);

export const studySetsOnClasses = mysqlTable(
  "StudySetsOnClasses",
  {
    studySetId: varchar("studySetId", { length: 191 }).notNull(),
    classId: varchar("classId", { length: 191 }).notNull(),
  },
  (table) => {
    return {
      studySetIdClassIdPk: primaryKey({
        columns: [table.studySetId, table.classId],
        name: "StudySetsOnClasses_studySetId_classId_pk",
      }),
      studySetIdIdx: index("StudySetsOnClasses_studySetId_idx").on(
        table.studySetId,
      ),
      classIdIdx: index("StudySetsOnClasses_classId_idx").on(table.classId),
    };
  },
);

export const foldersOnClasses = mysqlTable(
  "FoldersOnClasses",
  {
    folderId: varchar("folderId", { length: 191 }).notNull(),
    classId: varchar("classId", { length: 191 }).notNull(),
  },
  (table) => {
    return {
      folderIdClassIdPk: primaryKey({
        columns: [table.folderId, table.classId],
        name: "FoldersOnClasses_folderId_classId_pk",
      }),
      folderIdIdx: index("FoldersOnClasses_folderId_idx").on(table.folderId),
      classIdIdx: index("FoldersOnClasses_classId_idx").on(table.classId),
    };
  },
);

export const folder = mysqlTable(
  "Folder",
  {
    id: varchar("id", { length: 191 }).notNull(),
    userId: varchar("userId", { length: 191 }).notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 191 }),
    description: varchar("description", { length: 2000 }).notNull(),
  },
  (table) => {
    return {
      folderIdPk: primaryKey({ columns: [table.id], name: "Folder_id_pk" }),
      folderIdUserIdKey: unique("Folder_id_userId_key").on(
        table.id,
        table.userId,
      ),
      folderUserIdSlugKey: unique("Folder_userId_slug_key").on(
        table.userId,
        table.slug,
      ),
    };
  },
);

export const folderRelations = relations(folder, ({ one }) => ({
  user: one(user, {
    fields: [folder.userId],
    references: [user.id],
  }),
}));

export const studySet = mysqlTable(
  "StudySet",
  {
    id: varchar("id", { length: 191 }).notNull(),
    userId: varchar("userId", { length: 191 }).notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    type: mysqlEnum("type", ["Default", "Collab"]).notNull(),
    description: varchar("description", { length: 2000 }).notNull(),
    visibility: mysqlEnum("visibility", [
      "Private",
      "Unlisted",
      "Public",
      "Class",
    ])
      .default("Public")
      .notNull(),
  },
  (table) => {
    return {
      userIdIdx: index("StudySet_userId_idx").on(table.userId),
      studySetIdPk: primaryKey({ columns: [table.id], name: "StudySet_id_pk" }),
      studySetIdUserIdKey: unique("StudySet_id_userId_key").on(
        table.id,
        table.userId,
      ),
    };
  },
);

export const studySetRelations = relations(studySet, ({ one, many }) => ({
  user: one(user, {
    fields: [studySet.userId],
    references: [user.id],
  }),
  collaborators: many(studySetCollaborator),
}));

export const studySetCollaborator = mysqlTable(
  "StudySetCollaborator",
  {
    id: varchar("id", { length: 191 }).notNull(),
    studySetId: varchar("studySetId", { length: 191 }).notNull(),
    userId: varchar("userId", { length: 191 }).notNull(),
    createdAt: datetime("createdAt").notNull(),
  },
  (table) => {
    return {
      idPk: primaryKey({
        columns: [table.id],
      }),
      studySetIdIdx: index("StudySetCollaborator_studySetId_idx").on(
        table.studySetId,
        table.userId,
      ),
      userIdIdx: index("StudySetCollaborator_userId_idx").on(table.userId),
      studySetIdUserIdKey: unique(
        "StudySetCollaborator_studySetId_userId_key",
      ).on(table.studySetId, table.userId),
    };
  },
);

export const studySetCollaboratorRelations = relations(
  studySetCollaborator,
  ({ one }) => ({
    studySet: one(studySet, {
      fields: [studySetCollaborator.studySetId],
      references: [studySet.id],
    }),
    user: one(user, {
      fields: [studySetCollaborator.userId],
      references: [user.id],
    }),
  }),
);

export const studySetsOnFolders = mysqlTable(
  "StudySetsOnFolders",
  {
    studySetId: varchar("studySetId", { length: 191 }).notNull(),
    folderId: varchar("folderId", { length: 191 }).notNull(),
  },
  (table) => {
    return {
      studySetIdIdx: index("StudySetsOnFolders_studySetId_idx").on(
        table.studySetId,
      ),
      folderIdIdx: index("StudySetsOnFolders_folderId_idx").on(table.folderId),
      studySetsOnFoldersStudySetIdFolderIdPk: primaryKey({
        columns: [table.studySetId, table.folderId],
        name: "StudySetsOnFolders_studySetId_folderId_pk",
      }),
    };
  },
);

export const term = mysqlTable(
  "Term",
  {
    id: varchar("id", { length: 191 }).notNull(),
    studySetId: varchar("studySetId", { length: 191 }).notNull(),
    ephemeral: boolean("ephemeral").notNull().default(false),
  },
  (table) => {
    return {
      studySetIdIdx: index("Term_studySetId_idx").on(table.studySetId),
      termIdPk: primaryKey({ columns: [table.id], name: "Term_id_pk" }),
      termIdStudySetIdKey: unique("Term_id_studySetId_key").on(
        table.id,
        table.studySetId,
      ),
    };
  },
);

export const user = mysqlTable(
  "User",
  {
    id: varchar("id", { length: 191 }).notNull(),
    username: varchar("username", { length: 191 }),
    name: varchar("name", { length: 191 }),
    image: varchar("image", { length: 191 }),
    displayName: boolean("displayName").notNull().default(true),
    verified: boolean("verified").notNull().default(false),
  },
  (table) => {
    return {
      userIdPk: primaryKey({ columns: [table.id], name: "User_id_pk" }),
    };
  },
);
