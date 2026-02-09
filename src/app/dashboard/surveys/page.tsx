import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireCompany } from "@/lib/requireCompany";

export default async function SurveysPage() {
    const company = await requireCompany();

    const surveys = await prisma.survey.findMany({
        where: { companyId: company.id },
        include: {
            _count: {
                select: { responses: true },
            },
        },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="space-y-6">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900">Pesquisas</h1>
                    <p className="text-sm text-slate-500">{company.name}</p>
                </div>
                <Link
                    href="/dashboard/surveys/new"
                    className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                >
                    Criar nova pesquisa
                </Link>
            </header>

            <div className="grid grid-cols-1 gap-4">
                {surveys.map((survey) => (
                    <Link
                        key={survey.id}
                        href={`/dashboard/surveys/${survey.id}`}
                        className="group flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md md:flex-row md:items-center md:justify-between"
                    >
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-slate-900 group-hover:text-blue-600">
                                    {survey.title}
                                </h3>
                                <span
                                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${survey.status === "ACTIVE"
                                        ? "bg-emerald-100 text-emerald-700"
                                        : survey.status === "CLOSED"
                                            ? "bg-slate-100 text-slate-600"
                                            : "bg-amber-100 text-amber-700"
                                        }`}
                                >
                                    {survey.status === "ACTIVE"
                                        ? "Ativa"
                                        : survey.status === "CLOSED"
                                            ? "Encerrada"
                                            : "Rascunho"}
                                </span>
                            </div>
                            <p className="mt-1 text-xs text-slate-500">
                                Criada em {survey.createdAt.toLocaleDateString("pt-BR")}
                            </p>
                        </div>

                        <div className="flex items-center gap-6 text-sm text-slate-600">
                            <div className="flex flex-col items-center md:items-end">
                                <span className="font-semibold text-slate-900">
                                    {survey._count.responses}
                                </span>
                                <span className="text-xs">respostas</span>
                            </div>

                            {/* Optional: Add a quick delete/actions button here if needed, 
                  but navigating to details page is safer for main actions */}
                        </div>
                    </Link>
                ))}

                {surveys.length === 0 && (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 py-20 text-center">
                        <h3 className="text-lg font-medium text-slate-900">
                            Nenhuma pesquisa encontrada
                        </h3>
                        <p className="mt-1 max-w-sm text-sm text-slate-500">
                            Crie sua primeira pesquisa de clima para começar a ouvir seus colaboradores.
                        </p>
                        <Link
                            href="/dashboard/surveys/new"
                            className="mt-4 rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
                        >
                            Criar pesquisa agora
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
