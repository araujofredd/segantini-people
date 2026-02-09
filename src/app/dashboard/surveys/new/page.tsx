"use client";

import { useState } from "react";
import { createSurvey } from "../actions";
import Link from "next/link";

type QuestionType = "RATING" | "TEXT" | "BOOLEAN";

interface QuestionDraft {
    id: string; // temp id for UI
    text: string;
    type: QuestionType;
}

export default function NewSurveyPage() {
    const [questions, setQuestions] = useState<QuestionDraft[]>([
        { id: "1", text: "Em uma escala de 0 a 10, como você recomenda a empresa?", type: "RATING" },
    ]);

    const addQuestion = () => {
        setQuestions([
            ...questions,
            { id: crypto.randomUUID(), text: "", type: "RATING" },
        ]);
    };

    const removeQuestion = (id: string) => {
        setQuestions(questions.filter((q) => q.id !== id));
    };

    const updateQuestion = (id: string, field: keyof QuestionDraft, value: string) => {
        setQuestions(
            questions.map((q) => (q.id === id ? { ...q, [field]: value } : q))
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        // Rely on server action via form action, but need to attach JSON
        // The form below uses standard action={createSurvey} which automatically submits.
        // However, we need to inject the questions JSON. We can utilize a hidden input.
    };

    return (
        <div className="mx-auto max-w-2xl space-y-6">
            <header>
                <div className="mb-2">
                    <Link
                        href="/dashboard/surveys"
                        className="text-sm font-medium text-slate-500 hover:text-slate-700"
                    >
                        ← Voltar para pesquisas
                    </Link>
                </div>
                <h1 className="text-2xl font-semibold text-slate-900">Nova Pesquisa</h1>
                <p className="text-sm text-slate-500">
                    Configure as perguntas que serão enviadas aos colaboradores.
                </p>
            </header>

            <form action={createSurvey} className="space-y-6">
                {/* Hidden input to pass questions to server action */}
                <input type="hidden" name="questionsJson" value={JSON.stringify(questions)} />

                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                        Título da Pesquisa
                    </label>
                    <input
                        name="title"
                        className="w-full rounded-xl border border-slate-200 px-4 py-2 outline-none focus:ring-2 focus:ring-slate-900"
                        placeholder="Ex: Clima Organizacional Q1"
                        required
                        autoFocus
                    />
                </section>

                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-slate-900">Perguntas</h2>
                        <button
                            type="button"
                            onClick={addQuestion}
                            className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200"
                        >
                            + Adicionar Pergunta
                        </button>
                    </div>

                    <div className="space-y-4">
                        {questions.map((q, index) => (
                            <div
                                key={q.id}
                                className="relative rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all focus-within:ring-2 focus-within:ring-blue-100"
                            >
                                <div className="mb-2 flex items-center justify-between">
                                    <span className="text-xs font-bold uppercase text-slate-400">
                                        Pergunta {index + 1}
                                    </span>
                                    {questions.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeQuestion(q.id)}
                                            className="text-slate-400 hover:text-red-500"
                                            title="Remover pergunta"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                                className="h-4 w-4"
                                            >
                                                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                                            </svg>
                                        </button>
                                    )}
                                </div>

                                <div className="grid gap-3 sm:grid-cols-4">
                                    <div className="sm:col-span-3">
                                        <input
                                            value={q.text}
                                            onChange={(e) => updateQuestion(q.id, "text", e.target.value)}
                                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none placeholder:text-slate-300 focus:border-blue-500"
                                            placeholder="Digite a pergunta..."
                                            required
                                        />
                                    </div>
                                    <div>
                                        <select
                                            value={q.type}
                                            onChange={(e) => updateQuestion(q.id, "type", e.target.value as QuestionType)}
                                            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 outline-none focus:border-blue-500"
                                        >
                                            <option value="RATING">Escala (0-10)</option>
                                            <option value="TEXT">Texto Livre</option>
                                            <option value="BOOLEAN">Sim/Não</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        className="rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-slate-800 focus:ring-4 focus:ring-slate-200"
                    >
                        Salvar e Criar Pesquisa
                    </button>
                </div>
            </form>
        </div>
    );
}
