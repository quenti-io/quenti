import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  HeadObjectCommand,
  ListObjectsCommand,
} from "@aws-sdk/client-s3";
import jwt from "jsonwebtoken";

import { env } from "@quenti/env/server";

import { ASSETS_BUCKET, S3 } from ".";

export const getPresignedTermAssetJwt = (
  studySetId: string,
  termId: string,
) => {
  if (!S3) return "";

  return jwt.sign(
    { sub: `sets/${studySetId}/${termId}` },
    env.QUENTI_ENCRYPTION_KEY,
    {
      expiresIn: "120s",
    },
  );
};

export const getTermAssetUrl = async (studySetId: string, termId: string) => {
  if (!S3) return null;

  try {
    await S3.send(
      new HeadObjectCommand({
        Bucket: ASSETS_BUCKET,
        Key: `sets/${studySetId}/${termId}`,
      }),
    );

    return `${
      env.ASSETS_BUCKET_URL
    }/sets/${studySetId}/${termId}?etag=${Date.now()}`;
  } catch {
    return null;
  }
};

export const deleteTermAsset = async (studySetId: string, termId: string) => {
  if (!S3) return;

  await S3.send(
    new DeleteObjectCommand({
      Bucket: ASSETS_BUCKET,
      Key: `sets/${studySetId}/${termId}`,
    }),
  );
};

export const deleteTermAssets = async (keys: string[]) => {
  if (!S3) return;

  await S3.send(
    new DeleteObjectsCommand({
      Bucket: ASSETS_BUCKET,
      Delete: {
        Objects: keys.map((key) => ({ Key: key })),
      },
    }),
  );
};

export const deleteStudySetAssets = async (studySetId: string) => {
  if (!S3) return;

  const objects = await S3.send(
    new ListObjectsCommand({
      Bucket: ASSETS_BUCKET,
      Prefix: `sets/${studySetId}/`,
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
