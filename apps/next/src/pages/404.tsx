import { NotFoundPage } from "@quenti/components/404";

import { PageWrapper } from "../common/page-wrapper";
import { getLayout } from "../layouts/main-layout";

export default function Page() {
  return <NotFoundPage navbarHeight={80} ignoreMargin bgHsl="204, 45%, 98%" />;
}

Page.PageWrapper = PageWrapper;
Page.getLayout = getLayout;
