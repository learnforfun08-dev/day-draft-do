import React, { useEffect, useRef } from "react";
import { motion, useAnimation, useInView, Variants } from "framer-motion";

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: any;
  splitType?: "chars" | "words";
  from?: any;
  to?: any;
  threshold?: number;
  rootMargin?: string;
  textAlign?: "left" | "center" | "right";
}

const SplitText: React.FC<SplitTextProps> = ({
  text,
  className = "",
  delay = 0,
  duration = 0.5,
  ease = "easeOut",
  splitType = "chars",
  from = { opacity: 0, y: 20 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = "0px",
  textAlign = "left",
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  const splitText = () => {
    if (splitType === "words") {
      return text.split(" ");
    } else {
      return text.split("");
    }
  };

  const parts = splitText();

  const container: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: delay / 1000,
        delayChildren: 0,
      },
    },
  };

  const item: Variants = {
    hidden: {
      ...from,
    },
    visible: {
      ...to,
      transition: {
        duration,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      className={`${className} ${textAlign === "center" ? "text-center" : textAlign === "right" ? "text-right" : "text-left"}`}
      variants={container}
      initial="hidden"
      animate={controls}
    >
      {parts.map((part, index) => (
        <motion.span
          key={index}
          variants={item}
          style={{ display: "inline-block" }}
        >
          {part}
          {splitType === "words" && index < parts.length - 1 ? "\u00A0" : ""}
        </motion.span>
      ))}
    </motion.div>
  );
};

export default SplitText;