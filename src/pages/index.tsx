import AOS from "aos";
import "aos/dist/aos.css";
import type { NextPage } from "next";
import Head from "next/head";
import React from "react";
import { StaticWrapper } from "../components/static-wrapper";
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
    setTimeout(() => {
      AOS.init({
        easing: "ease",
        duration: 1000,
        once: true,
      });
    }, 100);
  }, []);

  return (
    <StaticWrapper>
      <Head>
        <title>Quizlet.cc - A batteries included Quizlet alternative</title>
      </Head>
      <Hero />
      <EngineeredLearn />
      <IntuitiveFlashcards />
      <TrackProgress />
      <MoreFeatures />
      <ComparisonChart />
      <ComingSoon />
      <EndSection />
    </StaticWrapper>
  );
};

export default Home;
