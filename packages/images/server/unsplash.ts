import { createApi } from "unsplash-js";
import type { ApiResponse } from "unsplash-js/dist/helpers/response";
import type { Photos } from "unsplash-js/dist/methods/search/types/response";

import { env } from "@quenti/env/server";

import { cache } from "./redis";
import { md5Hash } from "./utils";

export const unsplash = env.UNSPLASH_ACCESS_KEY
  ? createApi({
      accessKey: env.UNSPLASH_ACCESS_KEY,
    })
  : null;

export const getCachedSearch = async (query: string) => {
  const key = `unsplash:search:${md5Hash(query)}`;
  const cached = await cache?.get(key);
  return cached as ApiResponse<Photos> | undefined;
};

export const storeCachedSearch = async (
  query: string,
  data: ApiResponse<Photos> | undefined,
) => {
  const key = `unsplash:search:${md5Hash(query)}`;
  await cache?.set(key, data, {
    ex: 60 * 60,
  });
};

export const searchPhotos = async (
  query: string,
  getCache = true,
  storeCache = true,
): Promise<ApiResponse<Photos> | undefined> => {
  if (getCache) {
    const cached = await getCachedSearch(query);
    if (cached) return cached;
  }

  const result = await unsplash?.search.getPhotos({
    query,
    perPage: 7,
    contentFilter: "high",
  });

  if (storeCache) {
    await storeCachedSearch(query, result);
  }

  return result;
};

export const triggerDownload = async (url: string) => {
  await unsplash?.photos.trackDownload({
    downloadLocation: url,
  });
};
