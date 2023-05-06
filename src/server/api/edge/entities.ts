import type { Kysely } from "kysely";
import type { DB, EntityShare } from "../../../../kysely-types";
import { avatarUrl } from "../../../utils/avatar";

export interface ReturnedEntity {
  title: string;
  description: string;
  username: string;
  image: string;
  entities: number;
  type: EntityShare["type"];
}

export const getSharedEntity = async (
  db: Kysely<DB>,
  id: string
): Promise<ReturnedEntity | null> => {
  const entityShare = await db
    .selectFrom("EntityShare")
    .where("id", "=", id)
    .selectAll()
    .executeTakeFirst();

  if (!entityShare) return null;

  let title = "";
  let description = "";
  let username = "";
  let image = "";
  let entities = 0;

  if (entityShare.type == "StudySet") {
    const set = await db
      .selectFrom("StudySet")
      .where("id", "=", entityShare.entityId)
      .innerJoin("User", "StudySet.userId", "User.id")
      .innerJoin("Term", "StudySet.id", "Term.studySetId")
      .select([
        "StudySet.title",
        "StudySet.description",
        "StudySet.visibility",
        "User.username",
        "User.image",
      ])
      .select((e) => e.fn.countAll<number>("Term").as("entities"))
      .executeTakeFirst();

    if (!set || set.visibility == "Private") return null;

    title = set.title;
    description = set.description;
    username = set.username;
    image = avatarUrl({ username: set.username, image: set.image });
    entities = set.entities;
  } else {
    const folder = await db
      .selectFrom("Folder")
      .where("id", "=", entityShare.entityId)
      .innerJoin("User", "Folder.userId", "User.id")
      .innerJoin(
        "StudySetsOnFolders",
        "Folder.id",
        "StudySetsOnFolders.folderId"
      )
      .innerJoin("StudySet", "StudySetsOnFolders.studySetId", "StudySet.id")
      .where("StudySet.visibility", "=", "Public")
      .select([
        "Folder.title",
        "Folder.description",
        "User.username",
        "User.image",
      ])
      .select((e) => e.fn.countAll<number>("StudySet").as("entities"))
      .executeTakeFirst();

    if (!folder || !folder.entities) return null;

    title = folder.title;
    description = folder.description;
    username = folder.username;
    image = avatarUrl({ username: folder.username, image: folder.image });
    entities = folder.entities;
  }

  return {
    title,
    description,
    username,
    image,
    entities,
    type: entityShare.type,
  };
};

export const getEntityGeneric = async (
  db: Kysely<DB>,
  id: string | null,
  folderArgs?: { username: string; idOrSlug: string }
): Promise<ReturnedEntity | null> => {
  if (id) {
    if (id.startsWith("_")) return await getSharedEntity(db, id.slice(1));
    else if (id.startsWith("c")) {
      const set = await db
        .selectFrom("StudySet")
        .where("id", "=", id)
        .innerJoin("User", "StudySet.userId", "User.id")
        .innerJoin("Term", "StudySet.id", "Term.studySetId")
        .select([
          "StudySet.title",
          "StudySet.description",
          "StudySet.visibility",
          "User.username",
          "User.image",
        ])
        .select((e) => e.fn.countAll<number>("Term").as("entities"))
        .executeTakeFirst();

      if (!set || set.visibility == "Private") return null;

      return {
        title: set.title,
        description: set.description,
        username: set.username,
        image: avatarUrl({ username: set.username, image: set.image }),
        entities: set.entities,
        type: "StudySet",
      };
    } else return null;
  } else if (folderArgs) {
    const user = await db
      .selectFrom("User")
      .where("username", "=", folderArgs.username)
      .selectAll()
      .executeTakeFirst();

    if (!user) return null;

    const folder = await db
      .selectFrom("Folder")
      .where(({ or, and, cmpr }) =>
        or([
          and([
            cmpr("userId", "=", user.id),
            cmpr("id", "=", folderArgs.idOrSlug),
          ]),
          and([
            cmpr("userId", "=", user.id),
            cmpr("slug", "=", folderArgs.idOrSlug),
          ]),
        ])
      )
      .innerJoin(
        "StudySetsOnFolders",
        "Folder.id",
        "StudySetsOnFolders.folderId"
      )
      .innerJoin("StudySet", "StudySetsOnFolders.studySetId", "StudySet.id")
      .where("StudySet.visibility", "=", "Public")
      .select(["Folder.title", "Folder.description"])
      .select((e) => e.fn.countAll<number>("StudySet").as("entities"))
      .executeTakeFirst();

    if (!folder || !folder.entities) return null;

    return {
      title: folder.title,
      description: folder.description,
      username: user.username,
      image: avatarUrl(user),
      entities: folder.entities,
      type: "Folder",
    };
  }

  return null;
};
