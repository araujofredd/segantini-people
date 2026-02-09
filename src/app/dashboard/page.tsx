import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const { userId, orgId } = await auth();
  if (!userId) redirect("/sign-in");
  if (!orgId) redirect("/select-org");

  const company = await prisma.company.upsert({
    where: { clerkOrgId: orgId },
    update: {},
    create: {
      clerkOrgId: orgId,
      name: "Minha Empresa",
    },
  });

  // --- METRICS CALCULATION ---

  // 1. Total Active Employees
  const totalEmployees = await prisma.employee.count({
    where: { companyId: company.id },
  });

  // 2. Survey Responses Count (Participation)
  // We'll consider participation as unique employees who responded to ANY survey in the last 30 days (default)
  // Ideally this would be filtered by the selected period in the UI
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const uniqueRespondents = await prisma.surveyResponse.groupBy({
    by: ['employeeId'],
    where: {
      survey: { companyId: company.id },
      submittedAt: { gte: thirtyDaysAgo },
    },
    _count: true,
  });

  const participantCount = uniqueRespondents.length;
  const participationRate = totalEmployees > 0
    ? (participantCount / totalEmployees) * 100
    : 0;

  // 3. NPS & Satisfaction
  // Fetch all rating answers from the period
  const ratings = await prisma.surveyAnswer.findMany({
    where: {
      question: { type: 'RATING', survey: { companyId: company.id } },
      response: { submittedAt: { gte: thirtyDaysAgo } },
    },
    select: { valueNumber: true },
  });

  let nps = 0;
  let satisfaction = 0;

  if (ratings.length > 0) {
    // NPS Logic: Promoters (9-10) - Detractors (0-6)
    const prompts = ratings.filter(r => (r.valueNumber || 0) >= 9).length;
    const detracts = ratings.filter(r => (r.valueNumber || 0) <= 6).length;
    nps = ((prompts - detracts) / ratings.length) * 100;

    // Satisfaction Logic: Average of all ratings, normalized to % (assuming 0-10 scale)
    const sum = ratings.reduce((acc, curr: { valueNumber: number | null }) => acc + (curr.valueNumber || 0), 0);
    const avg = sum / ratings.length;
    satisfaction = (avg / 10) * 100;
  }

  const metrics = {
    nps,
    satisfaction,
    participation: participationRate,
    active: totalEmployees,
  };

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500">{company.name}</p>
        </div>
      </header>

      {/* FILTER TOOLBAR */}
      <div className="flex flex-wrap gap-3">
        <select className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-200" defaultValue="30">
          <option value="7">Últimos 7 dias</option>
          <option value="30">Últimos 30 dias</option>
          <option value="90">Últimos 90 dias</option>
        </select>

        <select className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-200" defaultValue="all">
          <option value="all">Todos os departamentos</option>
          <option value="tech">Tecnologia</option>
          <option value="sales">Comercial</option>
          <option value="ops">Operações</option>
        </select>
      </div>

      {/* KPIs */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl bg-orange-500 p-5 text-white shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-bold uppercase opacity-80">NPS</span>
            <span className="opacity-80">◎</span>
          </div>
          <div className="text-3xl font-bold">{metrics.nps.toFixed(1)}</div>
          <div className="mt-1 text-xs opacity-80">Calculado via eNPS</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">
              Índice de satisfação
            </span>
            <span>👍</span>
          </div>
          <div className="text-3xl font-bold text-slate-900">
            {metrics.satisfaction.toFixed(1)}%
          </div>
          <div className="mt-1 text-xs text-slate-500">Média de avaliações</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">
              Taxa de participação
            </span>
            <span>〰</span>
          </div>
          <div className="text-3xl font-bold text-slate-900">
            {metrics.participation.toFixed(1)}%
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Respostas no período
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">
              Colaboradores ativos
            </span>
            <span>👥</span>
          </div>
          <div className="text-3xl font-bold text-slate-900">
            {metrics.active}
          </div>
          <div className="mt-1 text-xs text-slate-500">Total cadastrados</div>
        </div>
      </section>

      {/* CHARTS (placeholders visuais) */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 font-semibold text-slate-900">
            Evolução do clima organizacional
          </div>
          <div className="flex h-64 items-center justify-center rounded-xl bg-orange-50 text-sm text-slate-500">
            Gráfico (vamos plugar depois)
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 font-semibold text-slate-900">
            Distribuição de sentimentos
          </div>
          <div className="flex h-64 items-center justify-center rounded-xl bg-slate-50 text-sm text-slate-500">
            Donut (vamos plugar depois)
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 font-semibold text-slate-900">
          Comparativo por departamento
        </div>
        <div className="flex h-56 items-center justify-center rounded-xl bg-slate-50 text-sm text-slate-500">
          Barras (vamos plugar depois)
        </div>
      </section>
    </div>
  );
}
