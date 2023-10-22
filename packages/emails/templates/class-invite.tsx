import {
  Button,
  Head,
  Html,
  Img,
  Preview,
  Tailwind,
} from "@react-email/components";

import { BODY_COPY_BASE } from "@quenti/branding";

import { BodyContainer } from "../components/body-container";
import { Content } from "../components/content";
import { Footer } from "../components/footer";
import { Heading } from "../components/heading";
import { MainContainer } from "../components/main-container";

export interface ClassInviteEmailProps {
  className: string;
  url: string;
  inviter: {
    image: string;
    email: string;
    name: string | null;
  };
}

export const ClasssInviteEmail = ({
  className = "Math 101",
  url = "http://localhost:3000/auth/login?callbackUrl=%2F",
  inviter = {
    image: "https://avatars.githubusercontent.com/u/1000?v=4",
    email: "john@acme.org",
    name: "John Doe",
  },
}: ClassInviteEmailProps) => {
  return (
    <Tailwind>
      <Html>
        <Head />
        <Preview>
          {inviter.name ?? inviter.email} has invited you to teach {className}{" "}
          on Quenti
        </Preview>
        <BodyContainer>
          <MainContainer>
            <Img
              src={inviter.image}
              width={42}
              height={42}
              alt={`${inviter.name ?? inviter.email}'s profile picture`}
              className="h-[42px] w-[42px] rounded-[21px]"
            />
            <Heading>
              <strong className="text-black">
                {inviter.name ?? inviter.email}
              </strong>{" "}
              has invited you to teach{" "}
              <strong className="text-black">{className}</strong> on Quenti
            </Heading>
            <Content>
              {BODY_COPY_BASE}{" "}
              <a
                href="https://quenti.io/organizations"
                className="text-blue-500"
              >
                Learn more
              </a>
              .
            </Content>
            <Button
              href={url}
              className="mt-3 rounded-md bg-[#1a5fff] px-6 py-3 text-base text-white"
            >
              Join class
            </Button>
          </MainContainer>
          <Footer withLogo />
        </BodyContainer>
      </Html>
    </Tailwind>
  );
};

export default ClasssInviteEmail;
