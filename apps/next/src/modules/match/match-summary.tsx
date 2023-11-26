import { useRouter } from "next/router";
import React from "react";

import { Link } from "@quenti/components";
import { HeadSeo } from "@quenti/components/head-seo";
import { api } from "@quenti/trpc";
import { MATCH_MIN_TIME } from "@quenti/trpc/server/common/constants";

import {
  Button,
  ButtonGroup,
  Container,
  HStack,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";

import { IconArrowBack, IconPlayerPlay, IconTrophy } from "@tabler/icons-react";

import { Loading } from "../../components/loading";
import { useEntityRootUrl } from "../../hooks/use-entity-root-url";
import { useSetFolderUnison } from "../../hooks/use-set-folder-unison";
import { Leaderboard } from "../leaderboard/leaderboard";
import { MatchSummaryFeedback } from "./match-summary-feedback";

export const MatchSummary = () => {
  const router = useRouter();
  const { id, title, type } = useSetFolderUnison();
  const rootUrl = useEntityRootUrl();

  const t = router.query.t as string;
  const eligible = (router.query.eligible as string) || "true";

  const safeParseT = (t: string) => {
    try {
      return parseInt(t);
    } catch {
      return 0;
    }
  };

  const leaderboard = api.leaderboard.byEntityId.useQuery(
    {
      mode: "Match",
      entityId: id,
    },
    {
      enabled: router.isReady,
    },
  );

  const { data: highscore, isFetchedAfterMount } =
    api.leaderboard.highscore.useQuery(
      {
        mode: "Match",
        entityId: id,
        eligible: eligible == "true",
      },
      {
        enabled: router.isReady,
      },
    );

  const elapsed =
    typeof highscore?.bestTime == "number"
      ? Math.max(highscore.bestTime, safeParseT(t))
      : null;

  if (!leaderboard.data || !highscore || !isFetchedAfterMount)
    return <Loading />;

  return (
    <Container maxW="container.md" py="10" display="flex" alignItems="center">
      <HeadSeo title={`Leaderboard - Match: ${title}`} />
      <Stack spacing="6" w="full">
        {!elapsed || elapsed >= MATCH_MIN_TIME ? (
          <>
            {elapsed ? (
              <MatchSummaryFeedback
                eligible={eligible == "true"}
                elapsed={elapsed}
                highscore={highscore}
                highscores={leaderboard.data.highscores}
              />
            ) : (
              <Stack spacing="1" mb="3" mx="3">
                <HStack
                  color="gray.600"
                  _dark={{
                    color: "gray.400",
                  }}
                >
                  <IconTrophy size={16} />
                  <Text>Leaderboard</Text>
                </HStack>
                <Heading size="lg">{title}</Heading>
              </Stack>
            )}
            {eligible == "true" && <Leaderboard data={leaderboard.data} />}
          </>
        ) : (
          <>
            <Heading size={"2xl"}>Woah! You{"'"}re too fast!</Heading>
            <Text>Your time was too fast to record on our leaderboard.</Text>
          </>
        )}
        <ButtonGroup w="full" justifyContent="end" spacing="3">
          <Button
            variant="outline"
            leftIcon={<IconArrowBack size={18} />}
            as={Link}
            href={rootUrl}
            colorScheme="gray"
          >
            Back to {type === "folder" ? "folder" : "set"}
          </Button>
          <Button
            onClick={async () => {
              await router.push(rootUrl + "/match");
            }}
            leftIcon={<IconPlayerPlay size={18} />}
          >
            {elapsed ? "Play again" : "Play Match"}
          </Button>
        </ButtonGroup>
      </Stack>
    </Container>
  );
};
