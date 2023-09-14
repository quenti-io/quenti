import React from "react";

export type FileReaderMethod = keyof Pick<
  InstanceType<typeof FileReader>,
  "readAsText" | "readAsBinaryString" | "readAsDataURL" | "readAsArrayBuffer"
>;

export interface UseFileReaderOptions {
  method: FileReaderMethod;
  onLoad?: (result: unknown) => void;
}

export const useFileReader = (options: UseFileReaderOptions) => {
  const { method = "readAsText", onLoad } = options;

  const [file, setFile] = React.useState<File | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<DOMException | null>(null);
  const [result, setResult] = React.useState<string | ArrayBuffer | null>(null);

  React.useEffect(() => {
    if (!file && result) {
      setResult(null);
    }
  }, [file, result]);

  React.useEffect(() => {
    if (!file) return;

    const reader = new FileReader();
    reader.onloadstart = () => setLoading(true);
    reader.onloadend = () => setLoading(false);
    reader.onerror = () => setError(reader.error);

    reader.onload = (e: ProgressEvent<FileReader>) => {
      setResult(e.target?.result ?? null);
      if (onLoad) {
        onLoad(e.target?.result ?? null);
      }
    };

    reader[method](file);
  }, [file, method, onLoad]);

  return [{ result, error, file, loading }, setFile] as const;
};
