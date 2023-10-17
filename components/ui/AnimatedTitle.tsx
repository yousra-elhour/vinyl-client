"use client";

import { useEffect, useState } from "react";
import { useAnimation, motion } from "framer-motion";

interface AnimatedTitleProps {
  text: string;
}

export default function AnimatedTitle({ text }: AnimatedTitleProps) {
  const ctrls = useAnimation();
  const [displayText, setDisplayText] = useState<string>(text);

  useEffect(() => {
    ctrls.start("visible");
  }, [ctrls, displayText]);

  useEffect(() => {
    // Update the displayText state when the text prop changes
    setDisplayText(text);
  }, [text]);

  const wordAnimation = {
    hidden: {},
    visible: {},
  };

  const characterAnimation = {
    hidden: {
      opacity: 0,
      y: `0.25em`,
    },
    visible: {
      opacity: 1,
      y: `0em`,
      transition: {
        duration: 1,
        ease: [0.2, 0.65, 0.3, 0.9],
      },
    },
  };

  return (
    <h1
      aria-label={displayText}
      role="heading"
      className="absolute top-0 right-0 font-bold heroTitle lg:leading-[27cqw] leading-[70cqw] clamped-text"
    >
      {displayText.split(" ").map((word, index) => {
        return (
          <motion.span
            aria-hidden="true"
            key={index}
            initial="hidden"
            animate={ctrls}
            variants={wordAnimation}
            transition={{
              delayChildren: index * 0.25,
              staggerChildren: 0.05,
            }}
            className="inline-block m-1"
          >
            {word.split("").map((character, index) => {
              return (
                <motion.span
                  aria-hidden="true"
                  key={index}
                  variants={characterAnimation}
                  className="inline-block mr-1"
                >
                  {character}
                </motion.span>
              );
            })}
          </motion.span>
        );
      })}
    </h1>
  );
}
