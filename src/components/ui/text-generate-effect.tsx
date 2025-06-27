import React, { useEffect, useState } from "react";

export interface TextGenerateEffectProps {
  words: string;
  className?: string;
  speed?: number; // ms per character
}

export function TextGenerateEffect({ words, className = "", speed = 18 }: TextGenerateEffectProps) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    setDisplayed("");
    if (!words) return;
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed((prev) => prev + words[i]);
      i++;
      if (i >= words.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [words, speed]);

  return (
    <span className={className} aria-label={words}>
      {displayed}
      <span className="animate-pulse">|</span>
    </span>
  );
}

export default TextGenerateEffect; 