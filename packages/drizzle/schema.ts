import { relations } from "drizzle-orm";
import {
  boolean,
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
    description: varchar("description", { length: 2000 }).notNull(),
    visibility: mysqlEnum("visibility", ["Private", "Unlisted", "Public"])
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

export const studySetRelations = relations(studySet, ({ one }) => ({
  user: one(user, {
    fields: [studySet.userId],
    references: [user.id],
  }),
}));

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
