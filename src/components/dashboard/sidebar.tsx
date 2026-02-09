"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/dashboard", label: "Visão geral" },
  { href: "/dashboard/employees", label: "Colaboradores" },
  { href: "/dashboard/surveys", label: "Pesquisas" },
  { href: "/dashboard/surveys/new", label: "Nova Pesquisa" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="dash-sidebar">
      <div className="dash-brand">
        <div className="dash-logo">SP</div>
        <div className="dash-brandText">
          <div className="dash-brandName">Segantini People</div>
          <div className="dash-brandSub">Dashboard</div>
        </div>
      </div>

      <nav className="dash-nav">
        {nav.map((item) => {
          const active =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`dash-link ${active ? "is-active" : ""}`}
            >
              <span className="dash-dot" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="dash-sidebarFooter">
        <div className="dash-hint">
          Dica: mantenha sua organização selecionada para navegar sem fricção.
        </div>
      </div>
    </aside>
  );
}
