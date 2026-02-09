"use client";

import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";

export default function Topbar() {
  return (
    <header className="dash-topbar">
      <div className="dash-searchWrap">
        <input
          className="dash-search"
          placeholder="Buscar..."
          onChange={() => {}}
        />
      </div>

      <div className="dash-actions">
        <div className="dash-org">
          <OrganizationSwitcher
            appearance={{
              elements: {
                rootBox: { width: "100%" },
              },
            }}
          />
        </div>

        <div className="dash-user">
          <UserButton afterSignOutUrl="/sign-in" />
        </div>
      </div>
    </header>
  );
}
