import React from "react";

import { Link } from "@quenti/components";
import { Modal } from "@quenti/components/modal";
import { WEBSITE_URL } from "@quenti/lib/constants/url";
import { api } from "@quenti/trpc";

import {
  Button,
  HStack,
  Input,
  Skeleton,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";

import { IconEditCircle, IconLock } from "@tabler/icons-react";

import { ToastWrapper } from "../../common/toast-wrapper";
import { AnimatedCheckCircle } from "../../components/animated-icons/check";
import { Toast } from "../../components/toast";
import { useSet } from "../../hooks/use-set";

export interface ShareSetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareSetModal: React.FC<ShareSetModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { id, visibility } = useSet();
  const toast = useToast();

  const getShareId = api.studySets.getShareId.useQuery(
    { studySetId: id },
    {
      enabled: isOpen && visibility !== "Private",
    },
  );
  const url = `${WEBSITE_URL}/_${getShareId.data || ""}`;

  const copy = async () => {
    await navigator.clipboard.writeText(url);
    onClose();

    toast({
      title: "Copied link to clipboard",
      status: "success",
      icon: <AnimatedCheckCircle />,
      colorScheme: "green",
      render: Toast,
    });
  };

  const mutedColor = useColorModeValue("gray.700", "gray.300");

  return (
    <ToastWrapper>
      <Modal isOpen={isOpen} onClose={onClose}>
        <Modal.Overlay />
        <Modal.Content>
          <Modal.Body>
            <Modal.Heading>
              <HStack>
                {visibility == "Private" && <IconLock size={32} />}
                <>
                  {visibility == "Private"
                    ? "This set is private"
                    : "Share this set"}
                </>
              </HStack>
            </Modal.Heading>
            {visibility !== "Private" ? (
              <HStack spacing="3" pb="4">
                <Skeleton
                  width="full"
                  rounded="lg"
                  isLoaded={!!getShareId.data}
                >
                  <Input
                    spellCheck={false}
                    fontWeight={600}
                    value={getShareId.isLoading ? "Loading..." : url}
                  />
                </Skeleton>
                <Skeleton rounded="lg" isLoaded={!!getShareId.data}>
                  <Button onClick={copy} variant="outline">
                    Copy link
                  </Button>
                </Skeleton>
              </HStack>
            ) : (
              <Text color={mutedColor}>
                You need to edit and un-private this set before you can share it
                with anyone.
              </Text>
            )}
          </Modal.Body>
          {visibility == "Private" ? (
            <>
              <Modal.Divider />
              <Modal.Footer>
                <Button
                  leftIcon={<IconEditCircle size={18} />}
                  as={Link}
                  href={`/${id}/edit`}
                >
                  Edit set
                </Button>
              </Modal.Footer>
            </>
          ) : (
            <></>
          )}
        </Modal.Content>
      </Modal>
    </ToastWrapper>
  );
};
