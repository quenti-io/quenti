import "@uploadthing/react/styles.css";
import { useSession } from "next-auth/react";
import Image from "next/image";

import { VStack } from "@chakra-ui/react";

import { Modal } from "../../components/modal";

interface UploadAvatarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UploadAvatarModal: React.FC<UploadAvatarModalProps> = ({
  isOpen,
  onClose,
}) => {
  const session = useSession()!.data!;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Body>
          <Modal.Heading>Upload avatar</Modal.Heading>
          <VStack>
            <Image
              src={session.user?.image || ""}
              alt="Avatar"
              width={64}
              height={64}
              className="highlight-block"
              style={{
                borderRadius: "50%",
              }}
            />
          </VStack>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
};
