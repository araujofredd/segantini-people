"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireCompany } from "@/lib/requireCompany";

const clean = (v: FormDataEntryValue | null) =>
  typeof v === "string" ? v.trim() : "";

export async function createEmployee(formData: FormData) {
  const company = await requireCompany();

  const fullName = clean(formData.get("fullName"));
  const email = clean(formData.get("email")) || null;
  const department = clean(formData.get("department")) || null;

  if (!fullName) throw new Error("Nome é obrigatório.");

  await prisma.employee.create({
    data: { companyId: company.id, fullName, email, department },
  });

  revalidatePath("/dashboard/employees");
}

export async function deleteEmployee(formData: FormData) {
  const company = await requireCompany();
  const id = clean(formData.get("id"));

  if (!id) return;

  await prisma.employee.deleteMany({
    where: { id, companyId: company.id },
  });

  revalidatePath("/dashboard/employees");
}

export async function updateEmployee(formData: FormData) {
  const company = await requireCompany();

  const id = clean(formData.get("id"));
  const fullName = clean(formData.get("fullName"));
  const email = clean(formData.get("email")) || null;
  const department = clean(formData.get("department")) || null;

  if (!id) throw new Error("ID inválido.");
  if (!fullName) throw new Error("Nome é obrigatório.");

  await prisma.employee.updateMany({
    where: { id, companyId: company.id },
    data: { fullName, email, department },
  });

  revalidatePath("/dashboard/employees");
}
