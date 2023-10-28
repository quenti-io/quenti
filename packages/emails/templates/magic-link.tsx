import { Button, Head, Html, Preview, Tailwind } from "@react-email/components";

import { BodyContainer } from "../components/body-container";
import { Content } from "../components/content";
import { Footer } from "../components/footer";
import { Heading } from "../components/heading";
import { Logo } from "../components/logo";
import { MainContainer } from "../components/main-container";

export interface MagicLinkEmailProps {
  url: string;
}

export const MagicLinkEmail = ({
  url = "http://localhost:3000/auth/login",
}: MagicLinkEmailProps) => {
  return (
    <Tailwind>
      <Html>
        <Head />
        <Preview>Your Quenti magic link</Preview>
        <BodyContainer>
          <MainContainer>
            <Logo />
            <Heading>Your Quenti magic link</Heading>
            <Button
              href={url}
              className="mb-2 mt-4 rounded-md bg-[#1a5fff] px-5 py-3 text-white"
            >
              Login to Quenti
            </Button>
            <Content>
              If you didn&apos;t request this, please ignore this email.
            </Content>
          </MainContainer>
          <Footer />
        </BodyContainer>
      </Html>
    </Tailwind>
  );
};

export default MagicLinkEmail;
