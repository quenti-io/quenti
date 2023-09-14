import { HeadObjectCommand } from "@aws-sdk/client-s3";
import jwt from "jsonwebtoken";

import { env } from "@quenti/env/server";

import { ASSETS_BUCKET, S3 } from ".";

export const getPresignedClassAssetJwt = (
  classId: string,
  asset: "logo" | "banner",
) => {
  if (!S3) return "";

  return jwt.sign(
    { sub: `classes/${classId}/${asset}.png` },
    env.QUENTI_ENCRYPTION_KEY,
    {
      expiresIn: "120s",
    },
  );
};

export const getClassAssetUrl = async (
  classId: string,
  asset: "logo" | "banner",
) => {
  if (!S3) return null;

  try {
    await S3.send(
      new HeadObjectCommand({
        Bucket: ASSETS_BUCKET,
        Key: `classes/${classId}/${asset}.png`,
      }),
    );

    return `${env.ASSETS_BUCKET_URL}/classes/${classId}/${asset}.png`;
  } catch {
    return null;
  }
};
