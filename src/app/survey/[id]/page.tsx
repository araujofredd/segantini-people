
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { submitSurvey } from "./actions";

export default async function SurveyPublicPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const survey = await prisma.survey.findUnique({
        where: { id },
        include: {
            questions: {
                orderBy: { order: "asc" },
            },
            company: {
                select: { name: true },
            },
        },
    });

    if (!survey) notFound();

    // If closed or draft, don't show (unless maybe preview? let's block for now)
    if (survey.status !== "ACTIVE") {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50 p-4">
                <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
                    <h1 className="text-xl font-bold text-slate-900">Pesquisa indisponível</h1>
                    <p className="mt-2 text-slate-500">
                        Esta pesquisa não está aceitando respostas no momento.
                    </p>
                </div>
            </div>
        );
    }

    const submitAction = submitSurvey.bind(null, survey.id);

    return (
        <div className="min-h-screen bg-slate-50 py-10 px-4">
            <div className="mx-auto max-w-xl">
                {/* Header */}
                <div className="mb-8 text-center">
                    <div className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                        {survey.company.name}
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900">{survey.title}</h1>
                    <p className="mt-2 text-slate-500">
                        Sua resposta é confidencial e nos ajuda a melhorar.
                    </p>
                </div>

                {/* Form */}
                <form action={submitAction} className="space-y-6">
                    {/* Identification */}
                    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-sm font-semibold text-slate-900">
                            Identificação
                        </h2>
                        <div className="space-y-1">
                            <label className="text-xs text-slate-600">Seu e-mail corporativo</label>
                            <input
                                type="email"
                                name="email"
                                className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900"
                                placeholder="seu.nome@empresa.com"
                                required
                            />
                            <p className="text-[11px] text-slate-400">
                                Usado apenas para validar que você faz parte da empresa.
                            </p>
                        </div>
                    </section>

                    {/* Questions */}
                    <section className="space-y-4">
                        {survey.questions.map((q) => (
                            <div
                                key={q.id}
                                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
                            >
                                <div className="mb-4 text-sm font-medium text-slate-900">
                                    {q.text}
                                </div>

                                <input type="hidden" name={`type_${q.id}`} value={q.type} />

                                {q.type === "RATING" && (
                                    <div className="flex flex-wrap gap-2">
                                        {Array.from({ length: 11 }).map((_, i) => (
                                            <label
                                                key={i}
                                                className="flex cursor-pointer flex-col items-center gap-1"
                                            >
                                                <input
                                                    type="radio"
                                                    name={`q_${q.id}`}
                                                    value={i}
                                                    className="peer sr-only"
                                                    required
                                                />
                                                <div className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 text-sm font-semibold text-slate-600 transition peer-checked:border-slate-900 peer-checked:bg-slate-900 peer-checked:text-white hover:bg-slate-50">
                                                    {i}
                                                </div>
                                            </label>
                                        ))}
                                        <div className="mt-2 flex w-full justify-between text-[10px] uppercase tracking-wide text-slate-400">
                                            <span>Discordo Totalmente</span>
                                            <span>Concordo Totalmente</span>
                                        </div>
                                    </div>
                                )}

                                {q.type === "BOOLEAN" && (
                                    <div className="flex gap-4">
                                        <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 hover:bg-slate-50">
                                            <input
                                                type="radio"
                                                name={`q_${q.id}`}
                                                value="true"
                                                className="text-slate-900 focus:ring-slate-900"
                                                required
                                            />
                                            <span className="text-sm">Sim</span>
                                        </label>
                                        <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 hover:bg-slate-50">
                                            <input
                                                type="radio"
                                                name={`q_${q.id}`}
                                                value="false"
                                                className="text-slate-900 focus:ring-slate-900"
                                                required
                                            />
                                            <span className="text-sm">Não</span>
                                        </label>
                                    </div>
                                )}

                                {q.type === "TEXT" && (
                                    <textarea
                                        name={`q_${q.id}`}
                                        rows={3}
                                        className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900"
                                        placeholder="Sua resposta..."
                                        required
                                    />
                                )}
                            </div>
                        ))}
                    </section>

                    <button
                        type="submit"
                        className="w-full rounded-xl bg-orange-500 px-6 py-4 text-sm font-bold text-white shadow-lg transition hover:bg-orange-600 hover:shadow-xl hover:-translate-y-0.5"
                    >
                        Enviar Respostas
                    </button>
                </form>
            </div>
        </div>
    );
}
