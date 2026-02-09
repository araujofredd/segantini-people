import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const { userId } = await auth();
  if (userId) redirect("/dashboard");

  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 10 }}>
        Segantini People
      </h1>
      <p style={{ marginBottom: 16 }}>
        Faça login para acessar o dashboard.
      </p>

      <div style={{ display: "flex", gap: 12 }}>
        <Link href="/sign-in">Entrar</Link>
        <Link href="/sign-up">Criar conta</Link>
      </div>
    </main>
  );
}
