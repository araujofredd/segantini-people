import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireCompany } from "@/lib/requireCompany";
import { updateEmployee } from "../../actions";

export default async function EditEmployeePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const company = await requireCompany();

  const employee = await prisma.employee.findFirst({
    where: { id, companyId: company.id },
  });

  if (!employee) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Editar colaborador
          </h1>
          <p className="text-sm text-slate-500">{company.name}</p>
        </div>

        <Link
          href="/dashboard/employees"
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Voltar
        </Link>
      </div>

      <section className="max-w-xl rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <form action={updateEmployee} className="space-y-3">
          <input type="hidden" name="id" value={employee.id} />

          <div>
            <label className="text-xs text-slate-600">Nome</label>
            <input
              name="fullName"
              defaultValue={employee.fullName}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-200"
              required
            />
          </div>

          <div>
            <label className="text-xs text-slate-600">E-mail</label>
            <input
              name="email"
              type="email"
              defaultValue={employee.email ?? ""}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-200"
            />
          </div>

          <div>
            <label className="text-xs text-slate-600">Departamento</label>
            <input
              name="department"
              defaultValue={employee.department ?? ""}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-200"
            />
          </div>

          <button className="w-full rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600">
            Salvar alterações
          </button>
        </form>
      </section>
    </div>
  );
}
