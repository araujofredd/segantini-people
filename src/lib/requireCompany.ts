// src/lib/requireCompany.ts
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function requireCompany() {
  const { userId, orgId } = await auth();

  if (!userId) redirect("/sign-in");
  if (!orgId) redirect("/select-org");

  const company = await prisma.company.upsert({
    where: { clerkOrgId: orgId },
    update: {},
    create: { clerkOrgId: orgId, name: "Minha Empresa" },
  });

  return company;
}
