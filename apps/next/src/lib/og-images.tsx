/* eslint-disable jsx-a11y/alt-text */

/* eslint-disable @next/next/no-img-element */
import React from "react";

import { env } from "@quenti/env/client";
import type { EntityImageProps, ProfileImageProps } from "@quenti/lib/seo";

const ImageWrapper: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
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
        src={`${env.NEXT_PUBLIC_APP_URL}/og-background.png`}
      />
      {children}
      <img
        tw="absolute bottom-0"
        width={1200}
        height={8}
        src={`${env.NEXT_PUBLIC_APP_URL}/og-line.png`}
      />
    </div>
  );
};

export const EntityImage: React.FC<EntityImageProps> = ({
  type,
  title,
  description,
  numItems,
  user,
  collaborators,
}) => {
  const entityLabel = type == "Folder" ? "set" : "term";

  return (
    <ImageWrapper>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div tw="flex justify-between">
          <div
            style={{
              display: "flex",
              width: collaborators ? "100%" : "90%",
              overflow: "hidden",
              flexDirection: "column",
              minWidth: 0,
            }}
          >
            <div
              tw="text-gray-500 text-xl font-bold"
              style={{ fontFamily: "Open Sans" }}
            >
              {type == "Folder"
                ? "Folder"
                : collaborators
                  ? "Collab"
                  : "Study set"}
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
          {!collaborators && (
            <img width="80" height="80" src={user.image} tw="rounded-full" />
          )}
        </div>
        {!collaborators ? (
          <p
            tw="text-gray-300 text-2xl h-46 overflow-hidden -mt-2"
            style={{
              whiteSpace: "pre-wrap",
            }}
          >
            {description.length ? description : `Created by ${user.username}`}
          </p>
        ) : (
          <div tw="flex items-center">
            {collaborators.avatars.map((avatar, i) => (
              <img
                key={i}
                width="64"
                height="64"
                src={avatar}
                tw="rounded-full mr-4"
              />
            ))}
            <p
              style={{
                fontFamily: "Outfit",
                color: "white",
              }}
              tw="text-4xl ml-2"
            >
              +{collaborators.total - 5}
            </p>
          </div>
        )}
      </div>
      <div tw="flex w-full justify-between items-end">
        <div tw="flex">
          <FooterLabel value={numItems} label={entityLabel} />
          {collaborators && (
            <FooterLabel value={collaborators.total} label="collaborator" />
          )}
        </div>
        <div tw="flex items-center">
          <img
            width="44"
            height="44"
            src={`${env.NEXT_PUBLIC_APP_URL}/avatars/quenti.png`}
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
    </ImageWrapper>
  );
};

interface FooterLabelProps {
  value: number;
  label: string;
}

const FooterLabel = ({ value, label }: FooterLabelProps) => {
  return (
    <div tw="flex items-end mt-6 mr-10">
      <h3
        style={{
          fontFamily: "Outfit",
          lineHeight: "14px",
        }}
        tw="text-white text-5xl"
      >
        {value}
      </h3>
      <div tw="text-xl text-gray-100 ml-2" style={{ fontFamily: "Open Sans" }}>
        {value != 1 ? `${label}s` : label}
      </div>
    </div>
  );
};

// TODO: Add the inline verified badge https://github.com/vercel/satori/issues/532
export const ProfileImage: React.FC<ProfileImageProps> = ({
  username,
  name,
  image,
}) => {
  return (
    <ImageWrapper>
      <div tw="flex w-full" style={{ gap: 40, boxSizing: "border-box" }}>
        <img width="120" height="120" src={image} tw="rounded-full" />
        <div tw="flex flex-col w-full">
          <h2
            tw="font-bold text-white text-7xl m-0 overflow-hidden max-w-[800px] pb-2"
            style={{
              fontFamily: "Outfit",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
            }}
          >
            {name ?? username}
          </h2>
          <p tw="text-gray-300 text-2xl -mt-2">@{username}</p>
        </div>
      </div>
      <div tw="flex items-center">
        <img
          width="44"
          height="44"
          src={`${env.NEXT_PUBLIC_APP_URL}/avatars/quenti.png`}
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
    </ImageWrapper>
  );
};
