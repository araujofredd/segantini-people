"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

const clean = (v: FormDataEntryValue | null) =>
    typeof v === "string" ? v.trim() : "";

export async function submitSurvey(surveyId: string, formData: FormData) {
    // 1. Identify Employee (Simple Email Check for MVP)
    // In a real app, we might use a unique token in the URL or auth
    const email = clean(formData.get("email"));
    if (!email) throw new Error("E-mail é obrigatório para identificação.");

    const survey = await prisma.survey.findUnique({
        where: { id: surveyId },
        include: { company: true },
    });

    if (!survey) throw new Error("Pesquisa não encontrada.");

    // Find employee in the survey's company
    const employee = await prisma.employee.findFirst({
        where: {
            companyId: survey.companyId,
            email: email,
        },
    });

    if (!employee) {
        throw new Error("E-mail não encontrado na base de colaboradores desta empresa.");
    }

    // Check if already responded
    const existingResponse = await prisma.surveyResponse.findFirst({
        where: {
            surveyId,
            employeeId: employee.id,
        },
    });

    if (existingResponse) {
        throw new Error("Você já respondeu esta pesquisa.");
    }

    // 2. Process Answers
    // Form data keys: `q_QUESTIONID` -> value
    const answersToCreate = [];

    for (const [key, value] of Array.from(formData.entries())) {
        if (key.startsWith("q_")) {
            const questionId = key.replace("q_", "");
            const val = clean(value);

            // Determine type implicitly or fetch question type (would be better),
            // for MVP we can try to guess or store as string/number based on parsing
            // But database schema has specific columns. 
            // Let's safe-guard by checking the key pattern or we accept that we need to lookup question type?
            // A faster way: Just save everything. But we need to know if it's number or string.
            // We can fetch questions again or just try to parse number.

            let valueNumber: number | null = null;
            let valueString: string | null = null;
            let valueBoolean: boolean | null = null;

            // Simple heuristic: if it looks like a number, save as number. 
            // (Risk: Text answer "123" becomes number. Ideally we pass types in hidden fields)
            // BETTER: The form can send `type_QUESTIONID` hidden field.

            const type = clean(formData.get(`type_${questionId}`));

            if (type === "RATING") {
                valueNumber = parseInt(val, 10);
            } else if (type === "BOOLEAN") {
                valueBoolean = val === "true";
            } else {
                valueString = val;
            }

            answersToCreate.push({
                questionId,
                valueNumber,
                valueString,
                valueBoolean,
            });
        }
    }

    // 3. Save Response
    await prisma.surveyResponse.create({
        data: {
            surveyId,
            employeeId: employee.id,
            submittedAt: new Date(),
            answers: {
                create: answersToCreate,
            },
        },
    });

    // Revalidate dashboard to update metrics immediately
    revalidatePath("/dashboard");
    revalidatePath(`/dashboard/surveys/${surveyId}`);

    // Redirect to thank you page
    redirect(`/survey/${surveyId}/thank-you`);
}
