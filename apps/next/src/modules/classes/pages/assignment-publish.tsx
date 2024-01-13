import { EditorContent, type JSONContent, useEditor } from "@tiptap/react";
import React from "react";

import { Heading, Stack } from "@chakra-ui/react";

import { useAssignment } from "../../../hooks/use-assignment";
import { extensions } from "../assignments/editor/description-editor";
import { ClassWizardLayout } from "../class-wizard-layout";

export const AssignmentPublish = () => {
  const { data: assignment } = useAssignment();

  const editor = useEditor({
    editable: false,
    content: (assignment?.description as JSONContent) || "<p></p>",
    extensions: extensions,
  });

  React.useEffect(() => {
    if (!assignment?.description) return;
    editor?.commands.setContent(assignment?.description as JSONContent);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assignment?.description]);

  return (
    <ClassWizardLayout
      title="Publish"
      seoTitle="Publish"
      currentStep={3}
      steps={4}
      description="You're almost done! Review your assignment and publish it to your class."
    >
      <Stack spacing="4">
        <Heading>{assignment?.title}</Heading>
        <EditorContent editor={editor} />
      </Stack>
    </ClassWizardLayout>
  );
};
