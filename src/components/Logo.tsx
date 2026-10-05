import React from "react";
import Image from "next/image";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showText?: boolean;
}

export default function Logo({
  size = "md",
  className = "",
  showText = true,
}: LogoProps) {
  const pixelMap = {
    sm: 44,
    md: 56,
    lg: 80,
    xl: 120,
  };

  const sizeClassMap = {
    sm: "w-11 h-11",
    md: "w-14 h-14",
    lg: "w-20 h-20",
    xl: "w-28 h-28",
  };

  const dim = pixelMap[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Official Rincón Dulce brand image icon */}
      <div
        className={`relative ${sizeClassMap[size]} shrink-0 rounded-full overflow-hidden shadow-md border-2 border-[#FFF3DE] bg-[#7A1E1E]`}
      >
        <Image
          src="/images/logo.png"
          alt="Rincón Dulce Pasto"
          width={dim}
          height={dim}
          priority={size === "sm" || size === "md"}
          className="w-full h-full object-cover"
        />
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className="font-display text-2xl font-bold tracking-wider text-[#7A1E1E] uppercase leading-none">
            Rincón Dulce
          </span>
          <span className="font-serif-bistro text-xs italic text-[#2B120E]/80 tracking-wide">
            Donde cada antojo sabe mejor • Pasto
          </span>
        </div>
      )}
    </div>
  );
}
