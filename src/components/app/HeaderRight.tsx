"use client";

import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";

export default function HeaderRight() {
  return (
    <div className="flex items-center gap-3">
      <OrganizationSwitcher
        afterSelectOrganizationUrl="/dashboard"
        afterCreateOrganizationUrl="/dashboard"
        appearance={{
          elements: {
            rootBox: "rounded-xl border border-slate-200 bg-white px-2 py-1",
          },
        }}
      />
      <UserButton
        appearance={{
          elements: {
            avatarBox: "h-9 w-9",
          },
        }}
      />
    </div>
  );
}
