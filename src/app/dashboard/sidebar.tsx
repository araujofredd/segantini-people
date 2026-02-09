"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function Item({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  const pathname = usePathname();
  const active = pathname === href || pathname?.startsWith(href + "/");

  return (
    <Link
      href={href}
      className={[
        "flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition",
        active
          ? "bg-orange-50 text-orange-700 ring-1 ring-orange-200"
          : "text-slate-600 hover:bg-slate-50",
      ].join(" ")}
    >
      <span
        className={[
          "h-2 w-2 rounded-full",
          active ? "bg-orange-500" : "bg-slate-300",
        ].join(" ")}
      />
      {label}
    </Link>
  );
}

export default function Sidebar() {
  return (
    <aside className="w-[280px] border-r border-slate-200 bg-white p-4">
      <div className="mb-6 flex items-center gap-3 rounded-2xl border border-slate-200 p-4">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-orange-500 text-white font-bold">
          SP
        </div>
        <div className="leading-tight">
          <div className="font-semibold text-slate-900">Segantini People</div>
          <div className="text-xs text-slate-500">Gestão de Clima</div>
        </div>
      </div>

      <nav className="space-y-2">
        <Item href="/dashboard" label="Dashboard" />
        <Item href="/dashboard/employees" label="Colaboradores" />
        <Item href="/dashboard/surveys" label="Pesquisas" />
        <Item href="/dashboard/surveys/new" label="Nova Pesquisa" />
      </nav>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">
        Dica: mantenha sua organização selecionada para navegar sem fricção.
      </div>
    </aside>
  );
}
