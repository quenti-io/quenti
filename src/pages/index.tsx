import { Box } from "@chakra-ui/react";
import type { NextPage } from "next";
import { EngineeredLearn } from "../modules/landing/engineered-learn";
import { Hero } from "../modules/landing/hero";
import { IntuitiveFlashcards } from "../modules/landing/intuitive-flashcards";
import { MoreFeatures } from "../modules/landing/more-features";
import { TrackProgress } from "../modules/landing/track-progress";
import { ComparisonChart } from "../modules/landing/comparison-chart";

const Home: NextPage = () => {
  return (
    <Box overflow="hidden" mb="32">
      <Hero />
      <EngineeredLearn />
      <IntuitiveFlashcards />
      <TrackProgress />
      <MoreFeatures />
      <ComparisonChart />
    </Box>
  );
};

export { getServerSideProps } from "../components/chakra";

export default Home;
