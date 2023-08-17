import { PageWrapper } from "../../common/page-wrapper";
import { singleIdServerSideProps as getServerSideProps } from "../../common/server-side-props";
import { ShareResolver as InternalShareResolver } from "../../components/share-resolver";

const ShareResolver = () => {
  return <InternalShareResolver />;
};

ShareResolver.PageWrapper = PageWrapper;

export default ShareResolver;
export { getServerSideProps };
