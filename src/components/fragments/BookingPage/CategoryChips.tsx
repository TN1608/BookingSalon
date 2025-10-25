"use client"
import React from "react";
import { CATEGORIES } from "@/app/booking/constants";

interface CategoryChipsProps {
  category: string;
  setCategory: (id: string) => void;
}

export default function CategoryChips({ category, setCategory }: CategoryChipsProps) {
  return (
    <div className="mt-4 overflow-x-auto">
      <div className="flex gap-2 min-w-max">
        <button
          onClick={() => setCategory("all")}
          className={`px-4 py-2 rounded-full border text-sm ${
            category === "all"
              ? "bg-foreground text-background border-foreground"
              : "border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          }`}
        >
          Featured
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => setCategory(c.id)}
            className={`px-4 py-2 rounded-full border text-sm ${
              category === c.id
                ? "bg-foreground text-background border-foreground"
                : "border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>
    </div>
  );
}
