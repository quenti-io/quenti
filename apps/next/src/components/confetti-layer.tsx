import React from "react";
import ReactCanvasConfetti from "react-canvas-confetti";

import { effectChannel } from "../events/effects";

const getAnimationSettings = (angle: number, originX: number) => {
  return {
    particleCount: 3,
    angle,
    spread: 100,
    origin: { x: originX },
    colors: ["#4b83ff", "#ffa54c"],
  };
};

export const ConfettiLayer = () => {
  const [confetti, setConfetti] = React.useState(false);

  React.useEffect(() => {
    const prepareConfetti = () => setConfetti(false);
    const handleConfetti = () => setConfetti(true);

    effectChannel.on("prepareConfetti", prepareConfetti);
    effectChannel.on("confetti", handleConfetti);
    return () => {
      effectChannel.off("prepareConfetti", prepareConfetti);
      effectChannel.off("confetti", handleConfetti);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!confetti) return null;
  return <ConfettiPlayer />;
};

export const ConfettiPlayer = () => {
  const refAnimationInstance = React.useRef<confetti.CreateTypes | null>(null);

  const getInstance = React.useCallback((instance) => {
    refAnimationInstance.current = instance;
  }, []) as (confetti: confetti.CreateTypes | null) => void;

  const nextTickAnimation = React.useCallback(() => {
    if (refAnimationInstance.current) {
      void (async () => {
        await refAnimationInstance.current!(getAnimationSettings(60, 0));
      })();
      void (async () => {
        await refAnimationInstance.current!(getAnimationSettings(120, 1));
      })();
    }
  }, []);

  React.useEffect(() => {
    const interval = setInterval(nextTickAnimation, 16);

    setTimeout(() => {
      clearInterval(interval);
    }, 1500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <ReactCanvasConfetti
        refConfetti={getInstance}
        style={{
          position: "fixed",
          zIndex: 1000,
          pointerEvents: "none",
          width: "100%",
          height: "100%",
          top: 0,
          left: 0,
        }}
      />
    </>
  );
};

export default ConfettiLayer;
