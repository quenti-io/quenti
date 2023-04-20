import type { EntityType } from "@prisma/client/edge";
import prisma from "../../../server/db-edge";
import { avatarUrl } from "../../../utils/avatar";

export interface ReturnedEntity {
  title: string;
  description: string;
  username: string;
  image: string;
  entities: number;
  type: EntityType;
}

export const getSharedEntity = async (
  id: string
): Promise<ReturnedEntity | null> => {
  const entityShare = await prisma.entityShare.findFirst({
    where: {
      id,
    },
  });
  if (!entityShare) return null;

  let title = "";
  let description = "";
  let username = "";
  let image = "";
  let entities = 0;

  if (entityShare.type == "StudySet") {
    const set = await prisma.studySet.findUnique({
      where: {
        id: entityShare.entityId,
      },
      include: {
        user: true,
        _count: {
          select: {
            terms: true,
          },
        },
      },
    });
    if (!set) return null;

    title = set.title;
    description = set.description;
    username = set.user.username;
    image = avatarUrl(set.user);
    entities = set._count.terms;
  } else {
    const folder = await prisma.folder.findUnique({
      where: {
        id: entityShare.entityId,
      },
      include: {
        user: true,
        studySets: {
          where: {
            studySet: {
              visibility: "Public",
            },
          },
        },
      },
    });
    if (!folder || !folder.studySets.length) return null;

    title = folder.title;
    description = folder.description;
    username = folder.user.username;
    image = avatarUrl(folder.user);
    entities = folder.studySets.length;
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
  id: string | null,
  folderArgs?: { username: string; idOrSlug: string }
): Promise<ReturnedEntity | null> => {
  if (id) {
    if (id.startsWith("_")) return await getSharedEntity(id.slice(1));
    else if (id.startsWith("c")) {
      const set = await prisma.studySet.findUnique({
        where: {
          id: id,
        },
        include: {
          user: true,
          _count: {
            select: {
              terms: true,
            },
          },
        },
      });
      if (!set) return null;

      return {
        title: set.title,
        description: set.description,
        username: set.user.username,
        image: avatarUrl(set.user),
        entities: set._count.terms,
        type: "StudySet",
      };
    } else return null;
  } else if (folderArgs) {
    const user = await prisma.user.findUnique({
      where: {
        username: folderArgs.username,
      },
    });
    if (!user) return null;

    const folder = await prisma.folder.findFirst({
      where: {
        OR: [
          {
            userId: user.id,
            id: folderArgs.idOrSlug,
          },
          {
            userId: user.id,
            slug: folderArgs.idOrSlug,
          },
        ],
      },
      include: {
        user: true,
        studySets: {
          where: {
            studySet: {
              visibility: "Public",
            },
          },
        },
      },
    });
    if (!folder || !folder.studySets.length) return null;

    return {
      title: folder.title,
      description: folder.description,
      username: folder.user.username,
      image: avatarUrl(folder.user),
      entities: folder.studySets.length,
      type: "Folder",
    };
  }

  return null;
};
