import React, { useEffect, useState } from "react";

export interface TypewriterWord {
  text: string;
  className?: string;
}

export interface TypewriterEffectProps {
  words: TypewriterWord[];
  className?: string;
  speed?: number; // ms per character
  pause?: number; // ms pause between words
}

export function TypewriterEffect({ words, className = "", speed = 60, pause = 900 }: TypewriterEffectProps) {
  const [displayed, setDisplayed] = useState<string>("");
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!words.length) return;
    let timeout: NodeJS.Timeout;
    const currentWord = words[wordIndex].text;
    if (!isDeleting) {
      if (charIndex < currentWord.length) {
        timeout = setTimeout(() => setCharIndex(charIndex + 1), speed);
      } else {
        timeout = setTimeout(() => setIsDeleting(true), pause);
      }
    } else {
      if (charIndex > 0) {
        timeout = setTimeout(() => setCharIndex(charIndex - 1), speed / 2);
      } else {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % words.length);
      }
    }
    setDisplayed(currentWord.slice(0, charIndex));
    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, wordIndex, words, speed, pause]);

  return (
    <span className={className}>
      {words.map((word, i) => (
        <span
          key={i}
          className={
            i === wordIndex ? word.className || "" : "hidden"
          }
          style={{ transition: "color 0.2s" }}
        >
          {i === wordIndex ? displayed : null}
        </span>
      ))}
      <span className="animate-pulse">|</span>
    </span>
  );
}

export default TypewriterEffect; 