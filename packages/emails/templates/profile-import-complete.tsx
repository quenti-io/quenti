import {
  Button,
  Head,
  Html,
  Img,
  Preview,
  Tailwind,
} from "@react-email/components";

import { BodyContainer } from "../components/body-container";
import { Content } from "../components/content";
import { Footer } from "../components/footer";
import { Heading } from "../components/heading";
import { MainContainer } from "../components/main-container";

export interface ProfileImportCompleteEmailProps {
  avatarUrl: string;
  profileUrl: string;
}

export const ProfileImportCompleteEmail = ({
  avatarUrl = "https://avatars.githubusercontent.com/u/1000?v=4",
  profileUrl = "http://localhost:3000/@profile",
}: ProfileImportCompleteEmailProps) => {
  return (
    <Tailwind>
      <Html>
        <Head />
        <Preview>
          We&apos;ve successfully imported your public study sets from Quizlet.
        </Preview>
        <BodyContainer>
          <MainContainer>
            <Img
              src={avatarUrl}
              width={42}
              height={42}
              alt="Profile picture"
              className="h-[42px] w-[42px] rounded-[21px]"
            />
            <Heading>Your profile is ready!</Heading>
            <Content>
              We&apos;ve successfully imported your public study sets from
              Quizlet.
            </Content>
            <Button
              href={profileUrl}
              className="mb-2 mt-4 rounded-md bg-[#1a5fff] px-5 py-3 text-white"
            >
              View your profile
            </Button>
          </MainContainer>
          <Footer withLogo />
        </BodyContainer>
      </Html>
    </Tailwind>
  );
};

export default ProfileImportCompleteEmail;
