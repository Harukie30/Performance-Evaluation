import React from "react";

export interface GlowingStarsBackgroundProps {
  children: React.ReactNode;
}

export function GlowingStarsBackground({ children }: GlowingStarsBackgroundProps) {
  // Generate 40 stars with random positions and animation delays
  const stars = Array.from({ length: 40 }).map((_, i) => {
    const top = Math.random() * 100;
    const left = Math.random() * 100;
    const size = 1 + Math.random() * 2.5;
    const delay = Math.random() * 4;
    return (
      <div
        key={i}
        className="absolute rounded-full bg-white/80 shadow-lg pointer-events-none"
        style={{
          top: `${top}%`,
          left: `${left}%`,
          width: `${size * 4}px`,
          height: `${size * 4}px`,
          filter: `blur(${size}px)`,
          opacity: 0.7,
          animation: `star-glow 2.5s ease-in-out ${delay}s infinite alternate`,
        }}
      />
    );
  });

  return (
    <div className="relative overflow-hidden min-h-[400px]">
      <div className="absolute inset-0 z-0">
        {stars}
        <style>{`
          @keyframes star-glow {
            0% { opacity: 0.5; filter: blur(1px); }
            100% { opacity: 1; filter: blur(3px); }
          }
        `}</style>
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export default GlowingStarsBackground; 