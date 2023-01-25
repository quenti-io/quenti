import { NextPage } from "next";
import { Hero } from "../components/hero";

const Home: NextPage = () => {
  return (
    <Hero />
  )
};

export { getServerSideProps } from "../components/chakra";

export default Home;
