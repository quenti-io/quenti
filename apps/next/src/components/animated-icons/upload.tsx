import { motion } from "framer-motion";

const draw = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: () => {
    return {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { type: "spring", duration: 1.5, bounce: 0 },
        opacity: { duration: 0.01 },
      },
    };
  },
};

export const AnimatedCloudUpload: React.FC<{ size?: number }> = ({
  size = 24,
}) => {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      stroke-width="2"
      stroke="currentColor"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial="hidden"
      animate="visible"
      style={{ minWidth: size }}
    >
      <motion.path
        stroke="none"
        d="M0 0h24v24H0z"
        fill="none"
        variants={draw}
      />
      <motion.path
        d="M7 18a4.6 4.4 0 0 1 0 -9a5 4.5 0 0 1 11 2h1a3.5 3.5 0 0 1 0 7h-1"
        variants={draw}
      />
      <motion.path d="M9 15l3 -3l3 3" variants={draw} />
      <motion.path d="M12 12l0 9" variants={draw} />
    </motion.svg>
  );
};
