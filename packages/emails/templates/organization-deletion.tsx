import { Head, Html, Preview, Tailwind } from "@react-email/components";

import { ORG_SUPPORT_EMAIL } from "@quenti/lib/constants/email";

import { BodyContainer } from "../components/body-container";
import { Content } from "../components/content";
import { Footer } from "../components/footer";
import { Heading } from "../components/heading";
import { Logo } from "../components/logo";
import { MainContainer } from "../components/main-container";

export interface OrganizationDeletionEmailProps {
  orgName: string;
}

export const OrganizationDeletionEmail = ({
  orgName = "Organization Name",
}: OrganizationDeletionEmailProps) => {
  return (
    <Tailwind>
      <Html>
        <Head />
        <Preview>
          Your organization {orgName} will be deleted in 48 hours
        </Preview>
        <BodyContainer>
          <MainContainer>
            <Logo />
            <Heading>
              [Urgent] Your organization <strong>{orgName}</strong> will be
              deleted in 48 hours
            </Heading>
            <Content>
              You&apos;re receiving this email because your organization{" "}
              <strong>{orgName}</strong> has been requested for deletion. If you
              believe this was a mistake, please{" "}
              <a href={`mailto:${ORG_SUPPORT_EMAIL}`}>contact us</a>{" "}
              immediately.
            </Content>
          </MainContainer>
          <Footer />
        </BodyContainer>
      </Html>
    </Tailwind>
  );
};

export default OrganizationDeletionEmail;
