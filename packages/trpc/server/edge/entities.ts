import { avatarUrl } from "@quenti/lib/avatar";
import type { DB, EntityShare } from "@quenti/prisma/kysely-types";
import type { Kysely } from "kysely";

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
    .where("EntityShare.id", "=", id)
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
      .where("StudySet.id", "=", entityShare.entityId)
      .innerJoin("User", "StudySet.userId", "User.id")
      .select([
        "StudySet.title",
        "StudySet.description",
        "StudySet.visibility",
        "User.username",
        "User.image",
      ])
      .select((eb) =>
        eb
          .selectFrom("Term")
          .where("Term.studySetId", "=", entityShare.entityId)
          .select((e) => e.fn.countAll<number>().as("entities"))
          .as("entities")
      )
      .executeTakeFirst();

    if (!set || set.visibility == "Private") return null;

    title = set.title;
    description = set.description;
    username = set.username;
    image = avatarUrl({ username: set.username, image: set.image });
    entities = set.entities || 0;
  } else {
    const folder = await db
      .selectFrom("Folder")
      .where("Folder.id", "=", entityShare.entityId)
      .innerJoin("User", "Folder.userId", "User.id")
      .select([
        "Folder.title",
        "Folder.description",
        "User.username",
        "User.image",
      ])
      .select((eb) =>
        eb
          .selectFrom("Folder")
          .where("Folder.id", "=", entityShare.entityId)
          .innerJoin(
            "StudySetsOnFolders",
            "Folder.id",
            "StudySetsOnFolders.folderId"
          )
          .innerJoin("StudySet", "StudySetsOnFolders.studySetId", "StudySet.id")
          .where("StudySet.visibility", "=", "Public")
          .select((e) => e.fn.countAll<number>("StudySet").as("entities"))
          .as("entities")
      )
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
        .where("StudySet.id", "=", id)
        .innerJoin("User", "StudySet.userId", "User.id")
        .select([
          "StudySet.title",
          "StudySet.description",
          "StudySet.visibility",
          "User.username",
          "User.image",
        ])
        .select((eb) =>
          eb
            .selectFrom("Term")
            .where("Term.studySetId", "=", id)
            .select((e) => e.fn.countAll<number>().as("entities"))
            .as("entities")
        )
        .executeTakeFirst();

      if (!set || set.visibility == "Private") return null;

      return {
        title: set.title,
        description: set.description,
        username: set.username,
        image: avatarUrl({ username: set.username, image: set.image }),
        entities: set.entities || 0,
        type: "StudySet",
      };
    } else return null;
  } else if (folderArgs) {
    const user = await db
      .selectFrom("User")
      .where("User.username", "=", folderArgs.username)
      .selectAll()
      .executeTakeFirst();

    if (!user) return null;

    const folder = await db
      .selectFrom("Folder")
      .where(({ or, and, cmpr }) =>
        or([
          and([
            cmpr("Folder.userId", "=", user.id),
            cmpr("Folder.id", "=", folderArgs.idOrSlug),
          ]),
          and([
            cmpr("Folder.userId", "=", user.id),
            cmpr("Folder.slug", "=", folderArgs.idOrSlug),
          ]),
        ])
      )
      .select(["Folder.title", "Folder.description"])
      .select((eb) =>
        eb
          .selectFrom("Folder")
          .where(({ or, and, cmpr }) =>
            or([
              and([
                cmpr("Folder.userId", "=", user.id),
                cmpr("Folder.id", "=", folderArgs.idOrSlug),
              ]),
              and([
                cmpr("Folder.userId", "=", user.id),
                cmpr("Folder.slug", "=", folderArgs.idOrSlug),
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
          .select((e) => e.fn.countAll<number>("StudySet").as("entities"))
          .as("entities")
      )
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
