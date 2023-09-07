import {
  DeleteObjectsCommand,
  ListObjectsCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

import { AVATARS_BUCKET, S3 } from ".";
import { md5Hash } from "./utils";

export const setUserAvatar = async (userId: string, avatar: Buffer) => {
  if (!S3) return;

  const md5 = md5Hash(avatar);

  await S3.send(
    new PutObjectCommand({
      Bucket: AVATARS_BUCKET,
      Key: `${userId}/avatars/${md5}.png`,
      ContentType: "image/png",
      CacheControl: "public, max-age=31536000",
    }),
  );

  const objects = await S3.send(
    new ListObjectsCommand({
      Bucket: AVATARS_BUCKET,
      Prefix: `${userId}/avatars`,
    }),
  );

  if (!objects.Contents?.length) return;

  const toDelete = new Array<{ Key: string }>();
  for (const object of objects.Contents) {
    if (object.Key && object.Key !== `${userId}/avatars/${md5}.png`) {
      toDelete.push({ Key: object.Key });
    }
  }

  await S3.send(
    new DeleteObjectsCommand({
      Bucket: AVATARS_BUCKET,
      Delete: { Objects: toDelete },
    }),
  );
};
