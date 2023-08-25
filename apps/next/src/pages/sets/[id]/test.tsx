import { HeadSeo } from "@quenti/components";
import { TestQuestionType } from "@quenti/interfaces";

import { Card, Container, Stack } from "@chakra-ui/react";

import { PageWrapper } from "../../../common/page-wrapper";
import { AuthedPage } from "../../../components/authed-page";
import { useSetFolderUnison } from "../../../hooks/use-set-folder-unison";
import { getLayout } from "../../../layouts/main-layout";
import { CreateTestData } from "../../../modules/create-test-data";
import HydrateSetData from "../../../modules/hydrate-set-data";
import { TestCardGap } from "../../../modules/test/card-gap";
import { MultipleChoiceCard } from "../../../modules/test/cards/multiple-choice-card";
import { TrueFalseCard } from "../../../modules/test/cards/true-false-card";
import { useTestContext } from "../../../stores/use-test-store";

const Test = () => {
  return (
    <AuthedPage>
      <HeadSeo title="Test" />
      <HydrateSetData disallowDirty>
        <CreateTestData>
          <Container maxW="4xl" mt="10">
            <TestContainer />
          </Container>
        </CreateTestData>
      </HydrateSetData>
    </AuthedPage>
  );
};

const TestContainer = () => {
  const { title } = useSetFolderUnison();
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
    <Stack spacing="0" pb="20">
      <TestCardGap type="start" title={title} />
      {outline.map((type, i) => (
        <>
          <TestCardGap
            type="question"
            index={i}
            numQuestions={outline.length}
          />
          <Card
            key={i}
            overflow="hidden"
            bg="white"
            borderWidth="2px"
            borderColor="gray.100"
            _dark={{
              bg: "gray.800",
              borderColor: "gray.750",
            }}
            rounded="2xl"
          >
            <Stack spacing={6} px="8" py="7">
              {card(type, i)}
            </Stack>
          </Card>
        </>
      ))}
      <TestCardGap type="finish" />
    </Stack>
  );
};

Test.PageWrapper = PageWrapper;
Test.getLayout = getLayout;

export default Test;
