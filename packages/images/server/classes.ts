import {
  DeleteObjectsCommand,
  HeadObjectCommand,
  ListObjectsCommand,
} from "@aws-sdk/client-s3";
import jwt from "jsonwebtoken";

import { env } from "@quenti/env/server";

import { ASSETS_BUCKET, S3 } from ".";

export const getPresignedClassAssetJwt = (
  classId: string,
  asset: "logo" | "banner",
) => {
  if (!S3) return "";

  return jwt.sign(
    { sub: `classes/${classId}/${asset}` },
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
        Key: `classes/${classId}/${asset}`,
      }),
    );

    return `${
      env.ASSETS_BUCKET_URL
    }/classes/${classId}/${asset}?etag=${Date.now()}`;
  } catch {
    return null;
  }
};

export const deleteClassAssets = async (classId: string) => {
  if (!S3) return;

  const objects = await S3.send(
    new ListObjectsCommand({
      Bucket: ASSETS_BUCKET,
      Prefix: `classes/${classId}/`,
    }),
  );

  const toDelete = new Array<{ Key: string }>();
  if (!objects.Contents?.length) return;

  for (const object of objects.Contents) {
    toDelete.push({ Key: object.Key! });
  }

  await S3.send(
    new DeleteObjectsCommand({
      Bucket: ASSETS_BUCKET,
      Delete: {
        Objects: toDelete,
      },
    }),
  );
};
