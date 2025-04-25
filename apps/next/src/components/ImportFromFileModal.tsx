// src/components/ImportFromFileModal.tsx
import { useRef, useState } from "react";
import {
  Button,
  Input,
  FormControl,
  FormErrorMessage,
  Spinner,
  useToast,
  Stack,
} from "@chakra-ui/react";
import { api } from "@quenti/trpc";
import { Modal } from "@quenti/components/modal";
import styles from "./glow-wrapper.module.css";

interface ImportFromFileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ImportFromFileModal({ isOpen, onClose }: ImportFromFileModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  const fromFile = api.import?.fromFile?.useMutation({
    onSuccess(data: { title: string; count: number; createdSetId: string }) {
      toast({ status: "success", description: `Importado “${data.title}” com ${data.count} cards.` });
      onClose();
      window.location.href = `/${data.createdSetId}`;
    },
    onError(err: { message: string }) {
      setError(err.message);
      setIsLoading(false);
    },
  });

  function handleSelectClick() {
    setError(undefined);
    inputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) {
      setError("Arquivo muito grande (máx. 5 MB).");
      return;
    }
    setFile(f);
    setError(undefined);
  }

  async function handleImport() {
    if (!file) {
      setError("Selecione um arquivo primeiro.");
      return;
    }
    setIsLoading(true);
    const content = file.name.endsWith(".apkg")
      ? await file.arrayBuffer().then(buf => Buffer.from(buf).toString("base64"))
      : await file.text();
    fromFile.mutate({ fileName: file.name, fileContent: content });
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered={false}>
      <Modal.Overlay />
      <Modal.Content
        className={styles.card}
        _before={{
          opacity: isLoading ? 1 : 0,
        }}
        _after={{
          opacity: isLoading ? 1 : 0,
        }}
      >
        <Stack
          bg="white"
          _dark={{
            bg: "gray.800",
          }}
          rounded="xl"
        >
          <Modal.Body>
            <Modal.Heading>Import from file</Modal.Heading>
            <FormControl isInvalid={!!error}>
              <Input
                type="file"
                accept=".md,.markdown,.json,.csv,.apkg"
                ref={inputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              <Button onClick={handleSelectClick} mb={2}>
                {file ? file.name : "Selecione um arquivo"}
              </Button>
              {error && <FormErrorMessage>{error}</FormErrorMessage>}
            </FormControl>
          </Modal.Body>
          <Modal.Divider />
          <Modal.Footer>
            <Button variant="ghost" onClick={onClose} isDisabled={isLoading}>Cancelar</Button>
            <Button colorScheme="blue" onClick={handleImport} isDisabled={!file || isLoading}>
              {isLoading ? <Spinner size="sm" /> : "Importar"}
            </Button>
        </Modal.Footer>
        </Stack>
      </Modal.Content>
    </Modal>
  );
}

export default ImportFromFileModal;