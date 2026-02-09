
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import dotenv from "dotenv";

// Load environment variables from .env if present
dotenv.config();
dotenv.config({ path: '.env.local' });

async function main() {
    console.log("🌱 Starting seed...");

    if (!process.env.DATABASE_URL) {
        throw new Error("DATABASE_URL is not defined");
    }

    // Same initialization logic as src/lib/prisma.ts
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        // Adjust ssl based on environment if needed, but for scripts typically we need it for prod databases
        ssl: process.env.DATABASE_URL.includes("localhost") ? false : { rejectUnauthorized: false },
    });

    const adapter = new PrismaPg(pool);
    const prisma = new PrismaClient({ adapter });

    try {
        // 1. Find or Create Company
        let company = await prisma.company.findFirst();

        if (!company) {
            console.log("No company found. Creating default 'Demo Company'...");
            company = await prisma.company.create({
                data: {
                    clerkOrgId: "org_demo_123",
                    name: "Demo Company",
                },
            });
        }

        console.log(`organization: ${company.name} (${company.id})`);

        // 2. Create Employees
        const employeeCount = await prisma.employee.count({
            where: { companyId: company.id },
        });

        let employees = [];
        if (employeeCount < 5) {
            console.log("Creating 20 employees...");
            const depts = ["Tecnologia", "Vendas", "RH", "Operações"];

            for (let i = 0; i < 20; i++) {
                const dept = depts[Math.floor(Math.random() * depts.length)];
                employees.push(
                    await prisma.employee.create({
                        data: {
                            companyId: company.id,
                            fullName: `Employee ${i + 1}`,
                            email: `employee${i + 1}@demo.com`,
                            department: dept,
                        }
                    })
                );
            }
        } else {
            console.log(`Found ${employeeCount} employees. Skipping creation.`);
            employees = await prisma.employee.findMany({ where: { companyId: company.id } });
        }

        // 3. Create Survey
        console.log("Creating Survey...");
        // Check if survey already exists to avoid duplicates on re-run
        const existingSurvey = await prisma.survey.findFirst({
            where: { title: "Pesquisa de Clima Q1 2026", companyId: company.id }
        });

        let survey;
        if (!existingSurvey) {
            survey = await prisma.survey.create({
                data: {
                    companyId: company.id,
                    title: "Pesquisa de Clima Q1 2026",
                    status: "ACTIVE",
                    questions: {
                        create: [
                            {
                                text: "Em uma escala de 0 a 10, o quanto você recomendaria a Segantini People como um bom lugar para trabalhar?",
                                type: "RATING",
                                order: 1,
                            },
                            {
                                text: "Como você avalia o ambiente de trabalho?",
                                type: "RATING",
                                order: 2,
                            },
                            {
                                text: "Você sente que tem as ferramentas necessárias para realizar seu trabalho?",
                                type: "BOOLEAN",
                                order: 3,
                            },
                        ],
                    },
                },
                include: { questions: true },
            });
        } else {
            console.log("Survey already exists.");
            survey = await prisma.survey.findUniqueOrThrow({
                where: { id: existingSurvey.id },
                include: { questions: true }
            });
        }

        const npsQuestion = survey.questions.find((q) => q.order === 1);
        const satisfQuestion = survey.questions.find((q) => q.order === 2);

        // 4. Create Responses
        console.log("Simulating responses...");

        const respondents = employees.slice(0, 15);

        for (const emp of respondents) {
            // Check if employee already responded
            const existingResponse = await prisma.surveyResponse.findFirst({
                where: { surveyId: survey.id, employeeId: emp.id }
            });

            if (existingResponse) continue;

            // Randomize NPS
            const npsScore = Math.random() > 0.3 ? Math.floor(Math.random() * 3) + 8 : Math.floor(Math.random() * 7);
            // Randomize Satisfaction
            const satScore = Math.floor(Math.random() * 4) + 6; // 6 to 10

            await prisma.surveyResponse.create({
                data: {
                    surveyId: survey.id,
                    employeeId: emp.id,
                    submittedAt: new Date(),
                    answers: {
                        create: [
                            {
                                questionId: npsQuestion!.id,
                                valueNumber: npsScore,
                            },
                            {
                                questionId: satisfQuestion!.id,
                                valueNumber: satScore,
                            },
                        ],
                    },
                },
            });
        }

        console.log("✅ Seed completed!");
    } catch (e) {
        console.error(e);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
