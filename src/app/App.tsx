import React from "react";
import chef from "../assets/icon-chef.png"; // +++

export default function App() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-amber-50/70 dark:bg-stone-900/50 border-b border-black/5 dark:border-white/10">
      <div className="container-cozy h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* replace emoji with your logo */}
          <img src={chef} alt="" className="h-9 w-9 rounded-full ring-1 ring-black/5 dark:ring-white/10" />
          <span className="font-serif text-xl tracking-tight">Lali’s Kitchen</span>
        </div>
        <span className="text-sm text-stone-600 dark:text-amber-200/80">Find recipes by ingredient</span>
      </div>
    </header>
  );
}
