import QRCode, { type QRCodeRenderersOptions } from "qrcode";
import React from "react";

export const useImageQrCode = () => {
  const ImageComponent = <T extends HTMLImageElement>({
    text,
    options,
  }: {
    text: string;
    options: QRCodeRenderersOptions;
  }) => {
    const ref = React.useRef<T>(null);

    React.useEffect(() => {
      if (ref?.current) {
        QRCode.toDataURL(text, options, (err, url) => {
          if (err) throw err;
          if (ref.current instanceof HTMLImageElement) {
            ref.current.src = url;
          }
        });
      }
    }, [text, options, ref]);

    // eslint-disable-next-line @next/next/no-img-element
    return <img ref={ref} alt={text} />;
  };

  const QR = React.useMemo(() => ImageComponent, []);

  return { QR };
};
