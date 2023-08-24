import { HeadSeo } from "@quenti/components";
import { TestQuestionType } from "@quenti/interfaces";

import { Card, Container, Stack } from "@chakra-ui/react";

import { PageWrapper } from "../../../common/page-wrapper";
import { AuthedPage } from "../../../components/authed-page";
import { getLayout } from "../../../layouts/main-layout";
import { CreateTestData } from "../../../modules/create-test-data";
import HydrateSetData from "../../../modules/hydrate-set-data";
import { MultipleChoiceCard } from "../../../modules/test/cards/multiple-choice-card";
import { TrueFalseCard } from "../../../modules/test/cards/true-false-card";
import { useTestContext } from "../../../stores/use-test-store";

const Test = () => {
  return (
    <AuthedPage>
      <HeadSeo title="Test" />
      <HydrateSetData disallowDirty>
        <CreateTestData>
          <Container maxW="4xl">
            <TestContainer />
          </Container>
        </CreateTestData>
      </HydrateSetData>
    </AuthedPage>
  );
};

const TestContainer = () => {
  const outline = useTestContext((s) => s.outline);

  const card = (type: TestQuestionType, i: number) => {
    switch (type) {
      case TestQuestionType.TrueFalse:
        return <TrueFalseCard i={i} />;
      case TestQuestionType.MultipleChoice:
        return <MultipleChoiceCard i={i} />;
      default:
        return null;
    }
  };

  return (
    <Stack spacing="8" mt="10">
      {outline.map((type, i) => (
        <Card
          key={i}
          overflow="hidden"
          bg="white"
          _dark={{
            bg: "gray.750",
          }}
          rounded="2xl"
        >
          <Stack spacing={6} px="8" py="7">
            {card(type, i)}
          </Stack>
        </Card>
      ))}
    </Stack>
  );
};

Test.PageWrapper = PageWrapper;
Test.getLayout = getLayout;

export default Test;
