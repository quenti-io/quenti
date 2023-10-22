import {
  DeleteObjectsCommand,
  HeadObjectCommand,
  ListObjectsCommand,
} from "@aws-sdk/client-s3";
import jwt from "jsonwebtoken";

import { env } from "@quenti/env/server";

import { ASSETS_BUCKET, S3 } from ".";

export type AssetContainer = "class" | "organization";

export type ClassAssetType = "logo" | "banner";
export type OrganizationAssetType = "logo";

export const getObjectKey = (t: AssetContainer) => {
  switch (t) {
    case "class":
      return "classes";
    case "organization":
      return "orgs";
  }
};

export const getPresignedObjectAssetJwt = <C extends AssetContainer>(
  container: C,
  id: string,
  asset: C extends "class" ? ClassAssetType : OrganizationAssetType,
) => {
  if (!S3) return "";

  return jwt.sign(
    { sub: `${getObjectKey(container)}/${id}/${asset}` },
    env.QUENTI_ENCRYPTION_KEY,
    {
      expiresIn: "120s",
    },
  );
};

export const getObjectAssetUrl = async <C extends AssetContainer>(
  container: C,
  id: string,
  asset: C extends "class" ? ClassAssetType : OrganizationAssetType,
) => {
  if (!S3) return null;

  try {
    await S3.send(
      new HeadObjectCommand({
        Bucket: ASSETS_BUCKET,
        Key: `${getObjectKey(container)}/${id}/${asset}`,
      }),
    );

    return `${env.ASSETS_BUCKET_URL}/${getObjectKey(
      container,
    )}/${id}/${asset}?etag=${Date.now()}`;
  } catch {
    return null;
  }
};

export const deleteObjectAssets = async <C extends AssetContainer>(
  container: C,
  id: string,
) => {
  if (!S3) return;

  const objects = await S3.send(
    new ListObjectsCommand({
      Bucket: ASSETS_BUCKET,
      Prefix: `${getObjectKey(container)}/${id}/`,
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
