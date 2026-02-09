import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireCompany } from "@/lib/requireCompany";
import { createEmployee, deleteEmployee } from "./actions";

export default async function EmployeesPage() {
  const company = await requireCompany();

  const employees = await prisma.employee.findMany({
    where: { companyId: company.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Colaboradores</h1>
          <p className="text-sm text-slate-500">{company.name}</p>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* CREATE */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-slate-900">
            Novo colaborador
          </h2>

          <form action={createEmployee} className="space-y-3">
            <div>
              <label className="text-xs text-slate-600">Nome</label>
              <input
                name="fullName"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-200"
                placeholder="Ex: Fredson Araújo"
                required
              />
            </div>

            <div>
              <label className="text-xs text-slate-600">E-mail</label>
              <input
                name="email"
                type="email"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-200"
                placeholder="exemplo@email.com"
              />
            </div>

            <div>
              <label className="text-xs text-slate-600">Departamento</label>
              <input
                name="department"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-200"
                placeholder="Ex: Diretoria"
              />
            </div>

            <button className="w-full rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600">
              Criar colaborador
            </button>
          </form>
        </section>

        {/* LIST */}
        <section className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">
              Lista ({employees.length})
            </h2>
            <div className="text-xs text-slate-500">
              Ações protegidas por empresa (org).
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-xs text-slate-500">
                  <th className="py-2">Nome</th>
                  <th className="py-2">Departamento</th>
                  <th className="py-2">E-mail</th>
                  <th className="py-2 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {employees.map((e) => (
                  <tr key={e.id} className="align-middle">
                    <td className="py-3 font-medium text-slate-900">
                      {e.fullName}
                    </td>
                    <td className="py-3 text-slate-600">{e.department ?? "—"}</td>
                    <td className="py-3 text-slate-600">{e.email ?? "—"}</td>
                    <td className="py-3">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/dashboard/employees/${e.id}/edit`}
                          className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          Editar
                        </Link>

                        <form action={deleteEmployee}>
                          <input type="hidden" name="id" value={e.id} />
                          <button className="rounded-xl border border-orange-200 bg-orange-50 px-3 py-2 text-xs font-semibold text-orange-700 hover:bg-orange-100">
                            Excluir
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}

                {employees.length === 0 && (
                  <tr>
                    <td className="py-6 text-slate-500" colSpan={4}>
                      Nenhum colaborador cadastrado ainda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
