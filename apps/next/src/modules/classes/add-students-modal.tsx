import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import {
  Controller,
  type SubmitHandler,
  type UseFormReturn,
  useForm,
} from "react-hook-form";
import { z } from "zod";

import { Modal } from "@quenti/components/modal";
import { ToggleGroup } from "@quenti/components/toggle-group";
import { api } from "@quenti/trpc";

import {
  Button,
  ButtonGroup,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

import { IconUpload, IconUser, IconUsers } from "@tabler/icons-react";

import { AutoResizeTextarea } from "../../components/auto-resize-textarea";
import { useClass } from "../../hooks/use-class";
import { getBaseDomain } from "../organizations/utils/get-base-domain";
import { SectionSelect } from "./section-select";

export interface AddStudentsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AddStudentsFormInputs {
  emails: string | string[];
  section: string;
}

const requiredEmail = (domain: string) =>
  z
    .string()
    .nonempty({ message: "Enter an email" })
    .email({ message: "Enter a valid email" })
    .endsWith(`@${domain}`, {
      message: `You can only add students from your organization's domain ${domain}`,
    });

const schema = (domain: string) =>
  z.object({
    emails: z.union([
      requiredEmail(domain),
      z.array(requiredEmail(domain)).nonempty("Emails are required"),
    ]),
    section: z.string().cuid2(),
  });

export const AddStudentsModal: React.FC<AddStudentsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const utils = api.useUtils();

  const [index, setIndex] = React.useState(0);

  const { data: class_ } = useClass();
  const base = getBaseDomain(class_?.organization ?? undefined);
  const student = class_?.organization?.domains.find(
    (x) => x.type == "Student",
  );
  const domain = student?.domain ?? base?.domain ?? "";

  const addStudentsFormMethods = useForm<AddStudentsFormInputs>({
    defaultValues: {
      emails: "",
      section: class_?.sections?.[0]?.id ?? "",
    },
    resolver: zodResolver(schema(domain)),
  });

  const addStudents = api.classes.addStudents.useMutation({
    onSuccess: async () => {
      await Promise.all([
        utils.classes.get.invalidate(),
        utils.classes.getStudents.invalidate(),
      ]);
      onClose();
    },
  });

  const onSubmit: SubmitHandler<AddStudentsFormInputs> = async (data) => {
    await addStudents.mutateAsync({
      classId: class_!.id,
      sectionId: data.section,
      emails: Array.isArray(data.emails) ? data.emails : [data.emails],
    });
  };

  React.useEffect(() => {
    addStudentsFormMethods.reset({
      section: class_?.sections?.[0]?.id ?? "",
    });
    setIndex(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const individualRef = React.useRef<HTMLInputElement>(null);
  const tabBorder = useColorModeValue("gray.200", "gray.700");
  const tabHover = useColorModeValue("gray.100", "gray.750");

  return (
    <Modal isOpen={isOpen} onClose={onClose} initialFocusRef={individualRef}>
      <Modal.Overlay />
      <form onSubmit={addStudentsFormMethods.handleSubmit(onSubmit)}>
        <Modal.Content>
          <Modal.Body>
            <Modal.Heading>Add students</Modal.Heading>
            <ToggleGroup
              index={index}
              onChange={setIndex}
              w="full"
              tabProps={{ w: "full", fontSize: "sm", fontWeight: 600 }}
              tabBorderColor={tabBorder}
              tabHoverColor={tabHover}
            >
              <ToggleGroup.Tab>
                <HStack>
                  <IconUser size={18} />
                  <Text>Individual</Text>
                </HStack>
              </ToggleGroup.Tab>
              <ToggleGroup.Tab>
                <HStack>
                  <IconUsers size={18} />
                  <Text>Bulk import</Text>
                </HStack>
              </ToggleGroup.Tab>
            </ToggleGroup>
            {index == 0 ? (
              <Individual
                ref={individualRef}
                domain={domain}
                methods={addStudentsFormMethods}
              />
            ) : (
              <BulkImport domain={domain} methods={addStudentsFormMethods} />
            )}
            <Controller
              name="section"
              control={addStudentsFormMethods.control}
              render={({ field: { value, onChange } }) => (
                <FormControl>
                  <FormLabel>Add to section</FormLabel>
                  <SectionSelect
                    value={value}
                    onChange={onChange}
                    sections={class_?.sections ?? []}
                  />
                </FormControl>
              )}
            />
          </Modal.Body>
          <Modal.Divider />
          <Modal.Footer>
            <ButtonGroup>
              <Button variant="ghost" colorScheme="gray" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" isLoading={addStudents.isLoading}>
                Add students
              </Button>
            </ButtonGroup>
          </Modal.Footer>
        </Modal.Content>
      </form>
    </Modal>
  );
};

interface PanelProps {
  domain: string;
  methods: UseFormReturn<AddStudentsFormInputs>;
}

const Individual = React.forwardRef<HTMLInputElement, PanelProps>(
  function Individual({ domain, methods }, ref) {
    const {
      formState: { errors },
    } = methods;

    return (
      <Controller
        name="emails"
        control={methods.control}
        render={({ field: { value, onChange } }) => (
          <FormControl isInvalid={!!errors.emails}>
            <FormLabel>Email</FormLabel>
            <Input
              ref={ref}
              placeholder={`student@${domain}`}
              defaultValue={value}
              onChange={(e) => onChange(e.target.value)}
            />
            <FormErrorMessage>{errors.emails?.message}</FormErrorMessage>
          </FormControl>
        )}
      />
    );
  },
);

export const BulkImport: React.FC<PanelProps> = ({ domain, methods }) => {
  const {
    formState: { errors },
  } = methods;

  const importRef = React.useRef<HTMLInputElement | null>(null);

  const handleFileUpload = (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    if (!target.files?.length) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      const content = e?.target?.result as string;
      const emails = content
        ?.split(",")
        .map((email) => email.trim().toLowerCase());
      methods.setValue("emails", emails);
    };

    reader.readAsText(target.files[0]!);
  };

  return (
    <Stack spacing="3">
      <Controller
        name="emails"
        control={methods.control}
        render={({ field: { value, onChange } }) => (
          <FormControl isInvalid={!!errors.emails}>
            <FormLabel>Emails</FormLabel>
            <AutoResizeTextarea
              allowTab={false}
              placeholder={`student-1@${domain}, student-2@${domain}`}
              minH="20"
              maxH="80"
              overflowY="auto"
              defaultValue={value}
              onChange={(e) => {
                const values = e.target.value.toLowerCase().split(",");

                const emails =
                  values.length == 1
                    ? values[0]!.trim()
                    : values.map((v) => v.trim());

                onChange(emails);
              }}
            />
            <FormErrorMessage>{errors.emails?.message}</FormErrorMessage>
          </FormControl>
        )}
      />
      <Button
        variant="outline"
        colorScheme="gray"
        leftIcon={<IconUpload size={18} />}
        onClick={() => {
          if (importRef.current) importRef.current.click();
        }}
      >
        Upload a .csv file
      </Button>
      <input
        ref={importRef}
        hidden
        id="bulkImport"
        type="file"
        accept=".csv"
        style={{ display: "none" }}
        onChange={(e) => {
          if (e) handleFileUpload(e);
        }}
      />
    </Stack>
  );
};
