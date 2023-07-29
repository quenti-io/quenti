import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Text,
} from "@react-email/components";
import { env } from "../../env/server.mjs";

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
    <Html>
      <Head />
      <Preview>Your verification code for {orgName}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img
            src={`${env.NEXT_PUBLIC_BASE_URL}/avatars/quenti.png`}
            width="42"
            height="42"
            alt="Quenti"
            style={logo}
          />
          <Heading style={heading}>
            Your verification code for {orgName}
          </Heading>
          <Text style={paragraph}>
            Someone (hopefully you) is trying to verify the domain{" "}
            <b>{domain}</b> for the organization <b>{orgName}</b> on Quenti. Not
            you? You can safely ignore this email.
          </Text>
          <code style={code}>{otp}</code>
          <Hr style={hr} />
          <Link href={env.NEXT_PUBLIC_BASE_URL} style={reportLink}>
            Quenti
          </Link>
        </Container>
      </Body>
    </Html>
  );
};

export default ConfirmCodeEmail;

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  width: "560px",
};

const logo = {
  borderRadius: 21,
  width: 42,
  height: 42,
};

const heading = {
  fontSize: "24px",
  letterSpacing: "-0.5px",
  lineHeight: "1.3",
  fontWeight: "700",
  color: "#171923",
  padding: "17px 0 0",
};

const paragraph = {
  margin: "0 0 15px",
  fontSize: "15px",
  lineHeight: "1.4",
  color: "#242C3A",
};

const reportLink = {
  fontSize: "14px",
  color: "#CBD5E0",
};

const hr = {
  borderColor: "#dfe1e4",
  margin: "42px 0 26px",
};

const code = {
  fontFamily: "monospace",
  fontWeight: "700",
  padding: "1px 4px",
  backgroundColor: "#CBD5E0",
  letterSpacing: "-0.3px",
  fontSize: "21px",
  borderRadius: "4px",
  color: "#242C3A",
};
