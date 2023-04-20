/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */

import { ImageResponse } from "@vercel/og";
import type { NextRequest } from "next/server";
import { getEntityGeneric } from "../../server/api/common/entities-edge";

export const config = {
  runtime: "edge",
};

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

export default async function handler(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const folderData = searchParams.get("folderData");

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
  if (!entity) return new ImageResponse(<></>);

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
            {entity.description.length
              ? entity.description
              : `Created by ${entity.username}`}
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
