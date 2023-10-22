import React from "react";

import type {
  Highscore,
  Leaderboard as LeaderboardType,
  User,
} from "@quenti/prisma/client";

import { Card, useColorModeValue } from "@chakra-ui/react";

import { LeaderboardEntry } from "./leaderboard-entry";

export interface LeaderboardProps {
  data: LeaderboardType & {
    highscores: (Highscore & {
      user: Pick<User, "id" | "username" | "image" | "verified">;
    })[];
  };
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ data }) => {
  const bg = useColorModeValue("white", "gray.750");

  return (
    <Card
      w="full"
      bg={bg}
      px="0"
      py="3"
      shadow="sm"
      rounded="xl"
      overflow="hidden"
    >
      {data.highscores.map((h, i) => (
        <LeaderboardEntry
          key={i}
          rank={i + 1}
          time={h.time}
          timestamp={h.timestamp}
          user={h.user}
        />
      ))}
    </Card>
  );
};
