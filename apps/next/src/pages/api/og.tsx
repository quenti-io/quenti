/* eslint-disable @next/next/no-img-element */

/* eslint-disable jsx-a11y/alt-text */
import { ImageResponse } from "@vercel/og";
import type { NextRequest } from "next/server";
import type { SatoriOptions } from "satori";
import { z } from "zod";

import { EntityImage, ProfileImage } from "../../lib/og-images";

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
  collaborators: z
    .object({
      total: z.number(),
      avatars: z.array(z.string()),
    })
    .optional(),
});

const profileSchema = z.object({
  username: z.string(),
  image: z.string(),
  name: z.string().nullish(),
  verified: z.boolean(),
});

export default async function handler(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const imageType = searchParams.get("type");

  const [openSansRegularData, outfitData] = await Promise.all([
    openSansRegular,
    outfit,
  ]);

  const ogConfig = {
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
    ] as SatoriOptions["fonts"],
  };

  switch (imageType) {
    case "StudySet":
    case "Folder": {
      const total = searchParams.get("collaborators");
      const avatars = searchParams.get("avatars");
      const collab =
        total && avatars
          ? {
              total: parseInt(total),
              avatars: JSON.parse(avatars) as string[],
            }
          : undefined;

      const { type, title, description, numItems, user, collaborators } =
        entitySchema.parse({
          type: searchParams.get("type"),
          title: searchParams.get("title"),
          description: searchParams.get("description"),
          numItems: parseInt(searchParams.get("numItems")!),
          user: {
            image: searchParams.get("userImage"),
            username: searchParams.get("username"),
          },
          collaborators: collab,
        });

      const img = new ImageResponse(
        (
          <EntityImage
            type={type}
            title={title}
            description={description}
            numItems={numItems}
            user={user}
            collaborators={collaborators}
          />
        ),
        ogConfig,
      ) as { body: BodyInit };

      return new Response(img.body, {
        status: 200,
        headers: { "Content-Type": "image/png" },
      });
    }

    case "profile": {
      const { username, image, name, verified } = profileSchema.parse({
        username: searchParams.get("username"),
        image: searchParams.get("image"),
        name: searchParams.get("name"),
        verified: searchParams.get("verified") === "true",
      });

      const img = new ImageResponse(
        (
          <ProfileImage
            username={username}
            image={image}
            name={name ?? null}
            verified={verified}
          />
        ),
        ogConfig,
      ) as { body: BodyInit };

      return new Response(img.body, {
        status: 200,
        headers: { "Content-Type": "image/png" },
      });
    }

    default: {
      return new Response(undefined, { status: 404 });
    }
  }
}
