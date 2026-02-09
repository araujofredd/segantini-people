"use client";

import HeaderRight from "@/components/app/HeaderRight";

export default function Topbar() {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="flex items-center justify-between gap-4 p-4">
        <div className="min-w-0 flex-1">
          <input
            placeholder="Buscar..."
            className="w-full max-w-[720px] rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-200"
          />
        </div>

        <HeaderRight />
      </div>
    </header>
  );
}
