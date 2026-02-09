import Link from "next/link";
import { createEmployee } from "../actions";

export default function NewEmployeePage() {
  return (
    <main style={{ padding: 24, maxWidth: 560 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Novo colaborador</h1>

      <form action={createEmployee} style={{ display: "grid", gap: 10 }}>
        <label style={{ display: "grid", gap: 6 }}>
          <span>Nome completo *</span>
          <input name="fullName" required style={{ padding: 10, borderRadius: 10, border: "1px solid #ddd" }} />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span>Departamento</span>
          <input name="department" style={{ padding: 10, borderRadius: 10, border: "1px solid #ddd" }} />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span>E-mail</span>
          <input name="email" type="email" style={{ padding: 10, borderRadius: 10, border: "1px solid #ddd" }} />
        </label>

        <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
          <button
            type="submit"
            style={{
              padding: "10px 14px",
              borderRadius: 10,
              border: "1px solid #ddd",
              cursor: "pointer",
              background: "#fff",
            }}
          >
            Salvar
          </button>

          <Link href="/dashboard/employees" style={{ padding: "10px 14px", textDecoration: "none" }}>
            Cancelar
          </Link>
        </div>
      </form>
    </main>
  );
}
