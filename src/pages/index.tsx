import { Box } from "@chakra-ui/react";
import AOS from "aos";
import "aos/dist/aos.css";
import type { NextPage } from "next";
import React from "react";
import { ComingSoon } from "../modules/landing/coming-soon";
import { ComparisonChart } from "../modules/landing/comparison-chart";
import { EndSection } from "../modules/landing/end-section";
import { EngineeredLearn } from "../modules/landing/engineered-learn";
import { Hero } from "../modules/landing/hero";
import { IntuitiveFlashcards } from "../modules/landing/intuitive-flashcards";
import { MoreFeatures } from "../modules/landing/more-features";
import { TrackProgress } from "../modules/landing/track-progress";

const Home: NextPage = () => {
  React.useEffect(() => {
    AOS.init({
      easing: "ease",
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <Box overflow="hidden">
      <Hero />
      <EngineeredLearn />
      <IntuitiveFlashcards />
      <TrackProgress />
      <MoreFeatures />
      <ComparisonChart />
      <ComingSoon />
      <EndSection />
    </Box>
  );
};

export { getServerSideProps } from "../components/chakra";

export default Home;
