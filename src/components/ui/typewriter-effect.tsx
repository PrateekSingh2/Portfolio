"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export const TypewriterEffect = ({ words }: { words: string[] }) => {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[index];

    // When text is fully typed, pause for 1.5s before deleting
    if (!isDeleting && text === currentWord) {
      const pauseTimer = setTimeout(() => {
        setIsDeleting(true);
      }, 1500);
      return () => clearTimeout(pauseTimer);
    }

    // When text is completely deleted, brief pause then next word
    if (isDeleting && text === "") {
      const pauseTimer = setTimeout(() => {
        setIsDeleting(false);
        setIndex((prev) => (prev + 1) % words.length);
      }, 400);
      return () => clearTimeout(pauseTimer);
    }

    const typingSpeed = isDeleting ? 40 : 80;

    const timer = setTimeout(() => {
      setText((prev) =>
        isDeleting ? prev.slice(0, -1) : currentWord.slice(0, prev.length + 1)
      );
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [text, isDeleting, index, words]);

  return (
    <span className="inline-block min-h-[1.5em]">
      {text}
      <motion.span
        animate={{ opacity: [0, 1, 0] }}
        transition={{ repeat: Infinity, duration: 0.8 }}
        className="inline-block w-[2px] h-[1em] bg-primary ml-1 align-middle"
      />
    </span>
  );
};
