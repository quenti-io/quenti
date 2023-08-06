import { ClassLayout } from "../../../modules/classes/class-layout";
import { ClassHome } from "../../../modules/classes/pages/class-home";

const Page = () => {
  return <ClassHome />;
};

Page.layout = ClassLayout;
export default Page;
