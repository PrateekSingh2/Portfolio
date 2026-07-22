"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export const TypewriterEffect = ({ words }: { words: string[] }) => {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[index];
    let typingSpeed = isDeleting ? 50 : 100;

    if (!isDeleting && text === currentWord) {
      typingSpeed = 2000;
      setIsDeleting(true);
    } else if (isDeleting && text === "") {
      setIsDeleting(false);
      setIndex((prev) => (prev + 1) % words.length);
      typingSpeed = 500;
    }

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
