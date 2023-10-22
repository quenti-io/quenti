import { Head, Html, Preview, Tailwind } from "@react-email/components";

import { BodyContainer } from "../components/body-container";
import { Content } from "../components/content";
import { Footer } from "../components/footer";
import { Heading } from "../components/heading";
import { Logo } from "../components/logo";
import { MainContainer } from "../components/main-container";

export interface ConfirmCodeEmailProps {
  orgName: string;
  domain: string;
  otp: string;
}

export const ConfirmCodeEmail = ({
  orgName = "Organization Name",
  domain = "example.org",
  otp = "102931",
}: ConfirmCodeEmailProps) => {
  return (
    <Tailwind>
      <Html>
        <Head />
        <Preview>Your verification code for {orgName}</Preview>
        <BodyContainer>
          <MainContainer>
            <Logo />
            <Heading>
              Your verification code for{" "}
              <strong className="text-black">{orgName}</strong>
            </Heading>
            <Content>
              Someone (hopefully you) is trying to verify the domain{" "}
              <b>{domain}</b> for the organization <b>{orgName}</b> on Quenti.
              Not you? You can safely ignore this email.
            </Content>
            <code className="rounded-md bg-gray-200 p-1 px-2 font-mono text-xl font-bold text-gray-700">
              {otp}
            </code>
          </MainContainer>
          <Footer />
        </BodyContainer>
      </Html>
    </Tailwind>
  );
};

export default ConfirmCodeEmail;
