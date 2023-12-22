import React from "react";

import { Modal } from "@quenti/components";
import { env } from "@quenti/env/client";
import { api } from "@quenti/trpc";

import {
  Box,
  Button,
  Center,
  Fade,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Text,
} from "@chakra-ui/react";

import { IconCopy, IconLinkPlus, IconTrash } from "@tabler/icons-react";

import { ConfirmModal } from "../../components/confirm-modal";
import { GhostGroup } from "../../components/ghost-group";
import { TooltipWithTouch } from "../../components/tooltip-with-touch";
import { useClass } from "../../hooks/use-class";
import { useImageQrCode } from "../../hooks/use-image-qrcode";
import { SectionSelect } from "./section-select";

interface ClassJoinCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectable?: boolean;
  sectionId?: string;
}

export const ClassJoinCodeModal: React.FC<ClassJoinCodeModalProps> = ({
  isOpen,
  onClose,
  selectable = false,
  sectionId: _sectionId,
}) => {
  const { data: class_ } = useClass();
  const utils = api.useUtils();

  const useSectionId = () => {
    const [selectedId, setSelectedId] = React.useState<string | undefined>(
      class_?.sections?.[0]?.id,
    );
    return {
      sectionId: selectable ? selectedId : _sectionId,
      setSectionId: setSelectedId,
    };
  };

  const { sectionId, setSectionId } = useSectionId();
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const { QR } = useImageQrCode();

  const section = class_!.sections!.find((s) => s.id === sectionId);
  const code = section?.joinCode?.code || null;

  const createJoinCode = api.classes.createJoinCode.useMutation({
    onSuccess: async () => {
      await utils.classes.get.invalidate();
    },
  });
  const deleteJoinCode = api.classes.deleteJoinCode.useMutation({
    onSuccess: async () => {
      await utils.classes.get.invalidate();
      setDeleteOpen(false);
    },
  });

  return (
    <>
      <ConfirmModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        heading="Delete join link?"
        body="Are you sure you want to delete this join link? Students will no longer be able to join this section with the current link."
        actionText="Delete"
        onConfirm={() =>
          deleteJoinCode.mutate({ classId: class_!.id, sectionId: sectionId! })
        }
        destructive
        isLoading={deleteJoinCode.isLoading}
      />
      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <Modal.Overlay />
        <Modal.Content>
          <Modal.Body>
            <Modal.Heading>Invite students</Modal.Heading>
            <Stack spacing="3">
              {selectable && (
                <Box mb="2" w="140px">
                  <SectionSelect
                    size="sm"
                    sections={class_?.sections || []}
                    onChange={(s) => setSectionId(s)}
                    value={sectionId || ""}
                  />
                </Box>
              )}
              <Text
                fontSize="sm"
                color="gray.600"
                _dark={{
                  color: "gray.400",
                }}
              >
                Create a link to invite students to join{" "}
                <strong>{section?.name}</strong>.
              </Text>
              {code ? (
                <Fade in>
                  <InputGroup>
                    <Input value={`${env.NEXT_PUBLIC_WEBSITE_URL}/j${code}`} />
                    <InputRightElement boxSize="40px">
                      <TooltipWithTouch
                        label={copied ? "Copied!" : "Copy link"}
                        placement="top"
                        fontSize="xs"
                        onMouseLeave={() => setCopied(false)}
                      >
                        <IconButton
                          rounded="md"
                          colorScheme="gray"
                          aria-label="Copy link"
                          variant="ghost"
                          icon={<IconCopy size={20} />}
                          size="sm"
                          onClick={async () => {
                            await navigator.clipboard.writeText(
                              `${env.NEXT_PUBLIC_WEBSITE_URL}/j${code}`,
                            );
                            setCopied(true);
                          }}
                        />
                      </TooltipWithTouch>
                    </InputRightElement>
                  </InputGroup>
                </Fade>
              ) : (
                <Button
                  leftIcon={<IconLinkPlus size={18} />}
                  variant="outline"
                  onClick={() => {
                    createJoinCode.mutate({
                      classId: class_!.id,
                      sectionId: sectionId!,
                    });
                  }}
                  isLoading={createJoinCode.isLoading}
                >
                  Create join link
                </Button>
              )}
            </Stack>
            {code && (
              <Button
                colorScheme="red"
                size="xs"
                w="max"
                variant="link"
                leftIcon={<IconTrash size={14} />}
                color="red.600"
                _dark={{
                  color: "red.200",
                }}
                onClick={() => setDeleteOpen(true)}
              >
                Delete link
              </Button>
            )}
            <Center>
              {code ? (
                <Fade in>
                  <Box overflow="hidden" rounded="md" shadow="xl" w="max">
                    <QR
                      text={`${env.NEXT_PUBLIC_WEBSITE_URL}/j${code}`}
                      options={{ width: 160, margin: 2 }}
                    />
                  </Box>
                </Fade>
              ) : (
                <Fade in>
                  <Box mt="100px">
                    <GhostGroup />
                  </Box>
                </Fade>
              )}
            </Center>
          </Modal.Body>
          <Modal.Divider />
          <Modal.Footer>
            <Button onClick={onClose}>Done</Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </>
  );
};
