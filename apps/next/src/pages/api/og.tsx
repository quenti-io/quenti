/* eslint-disable @next/next/no-img-element */

/* eslint-disable jsx-a11y/alt-text */
import { ImageResponse } from "@vercel/og";
import type { NextRequest } from "next/server";
import { z } from "zod";

import { env } from "@quenti/env/client";

export const config = {
  runtime: "edge",
};

const outfit = fetch(
  new URL("../../../public/assets/fonts/Outfit-Bold.ttf", import.meta.url),
).then((res) => res.arrayBuffer());
const openSansRegular = fetch(
  new URL("../../../public/assets/fonts/OpenSans-Regular.ttf", import.meta.url),
).then((res) => res.arrayBuffer());

const entitySchema = z.object({
  type: z.enum(["StudySet", "Folder"]),
  title: z.string(),
  description: z.string(),
  numItems: z.number(),
  user: z.object({
    image: z.string(),
    username: z.string(),
  }),
});

export default async function handler(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const { type, title, description, numItems, user } = entitySchema.parse({
    type: searchParams.get("type"),
    title: searchParams.get("title"),
    description: searchParams.get("description"),
    numItems: parseInt(searchParams.get("numItems")!),
    user: {
      image: searchParams.get("userImage"),
      username: searchParams.get("username"),
    },
  });

  const [openSansRegularData, outfitData] = await Promise.all([
    openSansRegular,
    outfit,
  ]);

  const entityLabel = type == "Folder" ? "set" : "term";

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
          src={`${env.NEXT_PUBLIC_BASE_URL}/og-background.png`}
        />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div tw="flex justify-between">
            <div
              style={{
                display: "flex",
                width: "80%",
                overflow: "hidden",
                flexDirection: "column",
                minWidth: 0,
              }}
            >
              <div
                tw="text-gray-500 text-xl font-bold"
                style={{ fontFamily: "Open Sans" }}
              >
                {type == "Folder" ? "Folder" : "Study set"}
              </div>
              <h2
                tw="font-bold text-white text-7xl overflow-hidden pb-4"
                style={{
                  fontFamily: "Outfit",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {title}
              </h2>
            </div>
            <img width="80" height="80" src={user.image} tw="rounded-full" />
          </div>
          <p
            tw="text-gray-400 text-2xl h-46 overflow-hidden -mt-2"
            style={{
              whiteSpace: "pre-wrap",
            }}
          >
            {description.length ? description : `Created by ${user.username}`}
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
              {numItems}
            </h3>
            <div
              tw="text-xl text-gray-100 ml-2"
              style={{ fontFamily: "Open Sans" }}
            >
              {numItems != 1 ? `${entityLabel}s` : entityLabel}
            </div>
          </div>
          <div tw="flex items-center">
            <img
              width="44"
              height="44"
              src={`${env.NEXT_PUBLIC_BASE_URL}/avatars/quenti.png`}
              tw="rounded-full"
            />
            <div
              style={{
                fontFamily: "Outfit",
              }}
              tw="text-white text-3xl ml-4"
            >
              Quenti
            </div>
          </div>
        </div>
        <img
          tw="absolute bottom-0"
          width={1200}
          height={8}
          src={`${env.NEXT_PUBLIC_BASE_URL}/og-line.png`}
        />
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
    },
  );
}
