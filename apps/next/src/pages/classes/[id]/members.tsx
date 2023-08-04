import { ClassLayout } from "../../../modules/classes/class-layout";
import { ClassMembers } from "../../../modules/classes/pages/class-members";

const Page = () => {
  return <ClassMembers />;
};
Page.layout = ClassLayout;

export default Page;
