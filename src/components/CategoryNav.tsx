"use client";

import React from "react";
import { Category } from "@/lib/types";

interface CategoryNavProps {
  categories: Category[];
  activeCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

export default function CategoryNav({
  categories,
  activeCategory,
  onSelectCategory,
}: CategoryNavProps) {
  return (
    <div className="sticky top-[86px] sm:top-[94px] z-30 bg-[#FFF7EE]/95 backdrop-blur-md border-b border-[#7A1E1E]/10 py-2.5 shadow-sm">
      <div className="max-w-6xl mx-auto px-4">
        {/* Horizontal scrollable pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 scroll-smooth">
          <button
            onClick={() => onSelectCategory("all")}
            className={`shrink-0 px-4 py-2 rounded-full font-bold text-xs uppercase tracking-wider transition-all duration-200 active:scale-95 ${
              activeCategory === "all"
                ? "bg-[#7A1E1E] text-[#FFF7EE] shadow-md scale-105"
                : "bg-white text-[#2B120E] border border-[#7A1E1E]/15 hover:bg-[#FFEBD4]"
            }`}
          >
            ⭐ Todo el Menú
          </button>

          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full font-bold text-xs uppercase tracking-wider transition-all duration-200 active:scale-95 ${
                  isActive
                    ? "bg-[#7A1E1E] text-[#FFF7EE] shadow-md scale-105"
                    : "bg-white text-[#2B120E] border border-[#7A1E1E]/15 hover:bg-[#FFEBD4]"
                }`}
              >
                <span>{cat.icon || "🍨"}</span>
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
