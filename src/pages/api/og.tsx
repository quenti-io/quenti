/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */

import type { EntityType } from "@prisma/client/edge";
import { ImageResponse } from "@vercel/og";
import type { NextRequest } from "next/server";
import prisma from "../../server/db-edge";
import { avatarUrl } from "../../utils/avatar";

export const config = {
  runtime: "edge",
};

const defaultOg = fetch(
  new URL("../../../public/og-image.png", import.meta.url)
).then((res) => res.arrayBuffer());
const ogBackground = fetch(
  new URL("../../../public/og-background.png", import.meta.url)
).then((res) => res.arrayBuffer());
const ogLine = fetch(
  new URL("../../../public/og-line.png", import.meta.url)
).then((res) => res.arrayBuffer());

const ogAvatarUrl = (image: string) =>
  image.startsWith("/")
    ? new URL(`../../../public/avatars/quizlet.png`, import.meta.url)
    : image;

const outfit = fetch(
  new URL("../../../public/assets/fonts/Outfit-Bold.ttf", import.meta.url)
).then((res) => res.arrayBuffer());
const openSansRegular = fetch(
  new URL("../../../public/assets/fonts/OpenSans-Regular.ttf", import.meta.url)
).then((res) => res.arrayBuffer());

interface ReturnedEntity {
  title: string;
  description: string;
  username: string;
  image: string;
  entities: number;
  type: EntityType;
}

const getSharedEntity = async (id: string): Promise<ReturnedEntity | null> => {
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

const getEntityGeneric = async (
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

export default async function handler(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const folderData = searchParams.get("folderData");

  const defaultReturn = async () => {
    const ogData = await defaultOg;
    // @ts-ignore
    return new ImageResponse(<img src={ogData} width="1200" height="628" />, {
      width: 1200,
      height: 628,
    });
  };

  let inputUsername, idOrSlug;
  if (folderData) {
    const [username, ...rawIdOrSlug] = folderData.split("+");
    const idOrSlugString = rawIdOrSlug.join("+");

    inputUsername = username;
    idOrSlug = idOrSlugString;
  }

  const entity = await getEntityGeneric(
    id,
    inputUsername && idOrSlug
      ? { username: inputUsername, idOrSlug }
      : undefined
  );
  if (!entity) return await defaultReturn();

  const avatarBuf = await fetch(ogAvatarUrl(entity.image)).then((res) =>
    res.arrayBuffer()
  );
  const logoBuf = await fetch(ogAvatarUrl("/")).then((res) =>
    res.arrayBuffer()
  );
  const backgroundBuf = await ogBackground;
  const lineBuf = await ogLine;

  const openSansRegularData = await openSansRegular;
  const outfitData = await outfit;

  const entityLabel = entity.type == "Folder" ? "set" : "term";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          backgroundColor: "#171923",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 84,
        }}
      >
        <img
          width={1200}
          height={628}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
          }}
          // @ts-ignore
          src={backgroundBuf}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div tw="flex justify-between">
            <div
              style={{
                display: "flex",
                width: "80%",
                overflow: "hidden",
                flexDirection: "column",
              }}
            >
              <div
                tw="uppercase text-gray-500 text-xl font-bold"
                style={{ fontFamily: "Open Sans" }}
              >
                {entity.type == "Folder" ? "Folder" : "Study Set"}
              </div>
              <h2
                tw="font-bold text-white text-7xl"
                style={{
                  fontFamily: "Outfit",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {entity.title}
              </h2>
            </div>
            {/* @ts-ignore */}
            <img width="80" height="80" src={avatarBuf} tw="rounded-full" />
          </div>
          <p
            tw="text-gray-400 text-2xl h-46 overflow-hidden"
            style={{
              whiteSpace: "pre-wrap",
            }}
          >
            {entity.description.length ? (
              entity.description
            ) : (
              <>
                Created by <b style={{ marginLeft: 8 }}>{entity.username}</b>
              </>
            )}
          </p>
        </div>
        <div tw="flex w-full justify-between items-end">
          <div tw="flex items-end mt-6">
            <h3
              style={{
                fontFamily: "Outfit",
                lineHeight: "14px",
              }}
              tw="text-white text-5xl"
            >
              {entity.entities}
            </h3>
            <div
              tw="text-xl text-gray-100 ml-2"
              style={{ fontFamily: "Open Sans" }}
            >
              {entity.entities != 1 ? `${entityLabel}s` : entityLabel}
            </div>
          </div>
          <div tw="flex items-center">
            {/* @ts-ignore */}
            <img width="44" height="44" src={logoBuf} tw="rounded-full" />
            <div
              style={{
                fontFamily: "Outfit",
              }}
              tw="text-white text-3xl ml-4"
            >
              Quizlet.cc
            </div>
          </div>
        </div>
        {/* @ts-ignore */}
        <img tw="absolute bottom-0" width={1200} height={8} src={lineBuf} />
      </div>
    ),
    {
      width: 1200,
      height: 628,
      fonts: [
        {
          name: "Open Sans",
          data: openSansRegularData,
          style: "normal",
          weight: 400,
        },
        {
          name: "Outfit",
          data: outfitData,
          style: "normal",
        },
      ],
    }
  );
}
