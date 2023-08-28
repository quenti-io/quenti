import React from "react";

import { HeadSeo } from "@quenti/components";

import { Container } from "@chakra-ui/react";

import { PageWrapper } from "../../../common/page-wrapper";
import { AuthedPage } from "../../../components/authed-page";
import { ConfirmModal } from "../../../components/confirm-modal";
import { useSetFolderUnison } from "../../../hooks/use-set-folder-unison";
import { getLayout } from "../../../layouts/main-layout";
import { CreateTestData } from "../../../modules/create-test-data";
import HydrateSetData from "../../../modules/hydrate-set-data";
import { LoadingView } from "../../../modules/test/loading-view";
import { ResultsView } from "../../../modules/test/results-view";
import { TestView } from "../../../modules/test/test-view";
import { TestContext, useTestContext } from "../../../stores/use-test-store";

const Test = () => {
  return (
    <AuthedPage>
      <HeadSeo title="Test" />
      <HydrateSetData disallowDirty>
        <SeoWrapper>
          <CreateTestData>
            <TestContainer />
          </CreateTestData>
        </SeoWrapper>
      </HydrateSetData>
    </AuthedPage>
  );
};

const SeoWrapper: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { title } = useSetFolderUnison();

  return (
    <>
      <HeadSeo title={`Test: ${title}`} />
      {children}
    </>
  );
};

const TestContainer = () => {
  const store = React.useContext(TestContext)!;
  const result = useTestContext((s) => s.result);
  const setEndedAt = useTestContext((s) => s.setEndedAt);
  const submit = useTestContext((s) => s.submit);
  const finalRef = React.useRef(null);

  const [hasUnansweredOpen, setHasUnansweredOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const checkAllAnswered = () => {
    return store.getState().timeline.every((question) => question.answered);
  };
  const scrollToFirstUnanswered = () => {
    const firstUnanswered = store
      .getState()
      .timeline.findIndex((question) => !question.answered);
    if (firstUnanswered == -1) return;

    const elem = document.getElementById(`test-card-${firstUnanswered}`);
    if (!elem) return;

    const position = elem.getBoundingClientRect();
    window.scrollTo({
      left: position.left,
      top: position.top + window.scrollY - 48,
      behavior: "smooth",
    });
  };

  const onSubmit = (bypass = false) => {
    if (!checkAllAnswered() && !bypass) {
      setHasUnansweredOpen(true);
      return;
    }

    setEndedAt(new Date());

    setLoading(true);
    setTimeout(
      () => {
        submit();
        setLoading(false);
      },
      Math.floor(Math.random() * 2000) + 2000,
    );
  };

  return (
    <>
      <ConfirmModal
        isOpen={hasUnansweredOpen}
        onClose={() => setHasUnansweredOpen(false)}
        actionText="Submit anyway"
        heading="Some questions are unanswered"
        body="Do you want to review your unanswered questions or submit the test now?"
        cancelText="Review questions"
        onCancel={() => {
          scrollToFirstUnanswered();
        }}
        onConfirm={() => {
          setHasUnansweredOpen(false);
          onSubmit(true);
        }}
        finalFocusRef={finalRef}
      />
      {loading ? (
        <LoadingView />
      ) : (
        <Container maxW="4xl" mt={{ base: 0, md: 10 }}>
          {result ? (
            <ResultsView />
          ) : (
            <TestView
              onSubmit={() => {
                onSubmit();
              }}
            />
          )}
        </Container>
      )}
    </>
  );
};

Test.PageWrapper = PageWrapper;
Test.getLayout = getLayout;

export default Test;
