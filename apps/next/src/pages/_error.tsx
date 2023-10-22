import { ErrorPage } from "@quenti/components/error-page";

import { PageWrapper } from "../common/page-wrapper";
import { getLayout } from "../layouts/main-layout";

export default function Page() {
  return <ErrorPage />;
}

Page.PageWrapper = PageWrapper;
Page.getLayout = getLayout;
