"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireCompany } from "@/lib/requireCompany";
import { QuestionType, SurveyStatus } from "@prisma/client";

const clean = (v: FormDataEntryValue | null) =>
    typeof v === "string" ? v.trim() : "";

export async function createSurvey(formData: FormData) {
    const company = await requireCompany();

    const title = clean(formData.get("title"));
    if (!title) throw new Error("Título é obrigatório.");

    // Parse questions from formData
    // Expected format: questions[0][text], questions[0][type], etc.
    // Ideally, we'd use a more robust form handling library or JSON submission for complex nested data,
    // but for now let's try to parse a hidden JSON field or rely on a specific client-side structure.
    // EASIER APPROACH: The client sends a JSON string in a hidden input named 'questionsJson'
    const questionsJson = clean(formData.get("questionsJson"));
    let questions: { text: string; type: QuestionType }[] = [];

    try {
        questions = JSON.parse(questionsJson);
    } catch (e) {
        throw new Error("Formato de questões inválido.");
    }

    if (!questions || questions.length === 0) {
        throw new Error("A pesquisa precisa de pelo menos uma pergunta.");
    }

    const survey = await prisma.survey.create({
        data: {
            companyId: company.id,
            title,
            status: "DRAFT", // Start as draft? Or Active? Let's say Active for simplicity now, or Draft based on another field.
            questions: {
                create: questions.map((q, index) => ({
                    text: q.text,
                    type: q.type,
                    order: index + 1,
                })),
            },
        },
    });

    revalidatePath("/dashboard/surveys");
    redirect(`/dashboard/surveys/${survey.id}`);
}

export async function deleteSurvey(formData: FormData) {
    const company = await requireCompany();
    const id = clean(formData.get("id"));

    if (!id) return;

    await prisma.survey.deleteMany({
        where: { id, companyId: company.id },
    });

    revalidatePath("/dashboard/surveys");
}

export async function closeSurvey(formData: FormData) {
    const company = await requireCompany();
    const id = clean(formData.get("id"));

    if (!id) return;

    await prisma.survey.updateMany({
        where: { id, companyId: company.id },
        data: { status: "CLOSED" }
    });

    revalidatePath(`/dashboard/surveys/${id}`);
    revalidatePath("/dashboard/surveys");
}
