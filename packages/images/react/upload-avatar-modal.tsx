import React from "react";
import Cropper from "react-easy-crop";

import { Modal } from "@quenti/components";
import type { Rect } from "@quenti/lib/area";
import { useFileReader } from "@quenti/lib/hooks";

import {
  Box,
  Button,
  ButtonGroup,
  Center,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";

import { IconUpload } from "@tabler/icons-react";

import { dataUrlToBuffer } from "./utils";

const MAX_IMAGE_SIZE = 512;

interface FileEvent<T = Element> extends React.FormEvent<T> {
  target: EventTarget & T;
}

interface UploadAvatarModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoading?: boolean;
  onError?: (error: string) => void;
  onSubmitBuffer?: (buffer: ArrayBuffer) => void;
}

export const UploadAvatarModal: React.FC<UploadAvatarModalProps> = ({
  isOpen,
  onClose,
  isLoading,
  onError,
  onSubmitBuffer,
}) => {
  const [crop, setCrop] = React.useState<Rect | null>(null);

  const [{ result }, setFile] = useFileReader({
    method: "readAsDataURL",
  });

  const onInputFile = (e: FileEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) {
      return;
    }

    const limit = 5 * 1000000; // max limit 5mb
    const file = e.target.files[0]!;

    if (file.size > limit) {
      onError?.(
        `That file is too large! Max file size is ${limit / 1000000} MB`,
      );
    } else {
      setFile(file);
    }
  };

  const submitBuffer = React.useCallback(
    async (crop: Rect | null) => {
      try {
        if (!crop) return;
        const croppedImage = await getCroppedImage(result as string, crop);
        const buffer = dataUrlToBuffer(croppedImage);
        onSubmitBuffer?.(buffer);
      } catch (e) {
        console.error(e);
      }
    },
    [onSubmitBuffer, result],
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Body>
          <Modal.Heading>Change avatar</Modal.Heading>
          <VStack spacing="6">
            <Box position="relative" h="40" w="40">
              {result ? (
                <CropContainer image={result as string} onComplete={setCrop} />
              ) : (
                <Center w="full" h="full" color="gray.500">
                  <VStack>
                    <Box
                      color="gray.300"
                      _dark={{
                        color: "gray.600",
                      }}
                    >
                      <IconUpload size={100} />
                    </Box>
                    <HStack fontSize="sm" fontWeight={500}>
                      <Text>Image files up to 5 MB</Text>
                    </HStack>
                  </VStack>
                </Center>
              )}
            </Box>
            <input
              onInput={onInputFile}
              style={{ display: "none" }}
              type="file"
              id="upload-avatar-input"
              accept="image/*"
            />
            <label htmlFor="upload-avatar-input">
              <Button as="span" cursor="pointer" variant="outline" size="sm">
                Choose a file
              </Button>
            </label>
          </VStack>
        </Modal.Body>
        <Modal.Divider />
        <Modal.Footer>
          <ButtonGroup>
            <Button variant="ghost" colorScheme="gray" onClick={onClose}>
              Cancel
            </Button>
            <Button isLoading={isLoading} onClick={() => submitBuffer(crop)}>
              Save
            </Button>
          </ButtonGroup>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};

interface CropContainerProps {
  image: string;
  onComplete: (crop: Rect) => void;
}

const CropContainer: React.FC<CropContainerProps> = ({ image, onComplete }) => {
  const [crop, setCrop] = React.useState({ x: 0, y: 0 });
  const [zoom, setZoom] = React.useState(1);

  return (
    <Box>
      <Cropper
        image={image}
        crop={crop}
        zoom={zoom}
        aspect={1}
        onCropChange={setCrop}
        onCropComplete={(_, crop) => onComplete(crop)}
        onZoomChange={setZoom}
        cropShape="round"
        style={{
          containerStyle: {
            borderRadius: "12px",
          },
        }}
      />
    </Box>
  );
};

const createImage = (url: string) => {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous"); // needed to avoid cross-origin issues on CodeSandbox
    image.src = url;
  });
};

const getCroppedImage = async (src: string, crop: Rect): Promise<string> => {
  const image = await createImage(src);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  const maxSize = Math.max(image.naturalWidth, image.naturalHeight);
  const resizeRatio =
    MAX_IMAGE_SIZE / maxSize < 1 ? Math.max(MAX_IMAGE_SIZE / maxSize, 0.75) : 1;

  ctx.imageSmoothingEnabled = false;
  canvas.width = canvas.height = Math.min(maxSize * resizeRatio, crop.width);

  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    canvas.width,
    canvas.height,
  );

  if (resizeRatio <= 0.75) {
    // With a smaller image, thus improved ratio. Keep doing this until the resizeRatio > 0.75.
    return getCroppedImage(canvas.toDataURL("image/png"), {
      width: canvas.width,
      height: canvas.height,
      x: 0,
      y: 0,
    });
  }

  return canvas.toDataURL("image/png");
};
