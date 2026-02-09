
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireCompany } from "@/lib/requireCompany";
import { closeSurvey } from "../actions";

export default async function SurveyDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const company = await requireCompany();

    const survey = await prisma.survey.findFirst({
        where: { id, companyId: company.id },
        include: {
            _count: { select: { responses: true } },
            questions: { orderBy: { order: "asc" } },
        },
    });

    if (!survey) notFound();

    // Determine the Public URL (assuming localhost for dev, but ideally from env)
    // We can use a relative path or construct full URL if we knew the host.
    // For UI display, we'll show the path and a copy button placeholder.
    const publicLink = `/survey/${survey.id}`;

    return (
        <div className="space-y-6">
            {/* Header */}
            <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <Link
                            href="/dashboard/surveys"
                            className="text-sm font-medium text-slate-500 hover:text-slate-700"
                        >
                            ← Voltar
                        </Link>
                    </div>
                    <h1 className="mt-1 text-2xl font-semibold text-slate-900">
                        {survey.title}
                    </h1>
                    <div className="mt-1 flex items-center gap-2">
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
                        <span className="text-sm text-slate-500">
                            • {survey._count.responses} respostas
                        </span>
                    </div>
                </div>

                <div className="flex gap-2">
                    {survey.status === "ACTIVE" && (
                        <form action={closeSurvey}>
                            <input type="hidden" name="id" value={survey.id} />
                            <button className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                                Encerrar Pesquisa
                            </button>
                        </form>
                    )}
                </div>
            </header>

            {/* Share Box */}
            {survey.status === "ACTIVE" && (
                <section className="rounded-2xl border border-blue-100 bg-blue-50 p-6">
                    <h3 className="mb-2 text-sm font-bold text-blue-900">
                        🚀 Pesquisa Ativa
                    </h3>
                    <p className="mb-4 text-sm text-blue-700">
                        Compartilhe o link abaixo com seus colaboradores para coletar respostas.
                    </p>

                    <div className="flex items-center gap-2 rounded-xl border border-blue-200 bg-white p-2">
                        <code className="flex-1 overflow-x-auto whitespace-nowrap px-2 text-sm text-slate-600">
                            {`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}${publicLink}`}
                        </code>
                        <a
                            href={publicLink}
                            target="_blank"
                            className="rounded-lg bg-blue-100 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-200"
                        >
                            Abrir
                        </a>
                    </div>
                </section>
            )}

            {/* Questions Preview & Simple Stats */}
            <section className="space-y-6">
                <h2 className="text-lg font-semibold text-slate-900">Perguntas</h2>
                <div className="grid gap-4">
                    {survey.questions.map((q, i) => (
                        <div key={q.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                            <div className="mb-2 text-xs font-bold uppercase text-slate-400">
                                Pergunta {i + 1} • {q.type}
                            </div>
                            <div className="font-medium text-slate-900">{q.text}</div>

                            {/* Placeholder for future detailed stats per question */}
                            <div className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-500">
                                Ver detalhes de respostas (em breve)
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
