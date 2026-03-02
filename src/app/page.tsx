import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const { userId } = await auth();
  if (userId) redirect("/dashboard");

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .landing-root {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
          background: #f6f7fb;
        }

        /* ====== LEFT PANEL (Brand) ====== */
        .left-panel {
          background: linear-gradient(145deg, #1a0a00 0%, #2d1200 40%, #ff6a00 100%);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 48px;
          position: relative;
          overflow: hidden;
        }

        .left-panel::before {
          content: '';
          position: absolute;
          top: -120px;
          right: -120px;
          width: 420px;
          height: 420px;
          background: radial-gradient(circle, rgba(255,106,0,0.35) 0%, transparent 70%);
          border-radius: 50%;
          animation: pulse 6s ease-in-out infinite;
        }

        .left-panel::after {
          content: '';
          position: absolute;
          bottom: -80px;
          left: -80px;
          width: 320px;
          height: 320px;
          background: radial-gradient(circle, rgba(255,138,43,0.20) 0%, transparent 70%);
          border-radius: 50%;
          animation: pulse 8s ease-in-out infinite reverse;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.1); opacity: 1; }
        }

        .brand-top {
          position: relative;
          z-index: 2;
        }

        .brand-logo {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .logo-mark {
          width: 52px;
          height: 52px;
          border-radius: 16px;
          background: rgba(255,255,255,0.15);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.25);
          display: grid;
          place-items: center;
          font-weight: 900;
          font-size: 20px;
          color: #fff;
          letter-spacing: -0.5px;
        }

        .logo-text {
          color: #fff;
          font-weight: 800;
          font-size: 20px;
          letter-spacing: -0.3px;
        }

        .logo-sub {
          color: rgba(255,255,255,0.55);
          font-size: 12px;
          font-weight: 500;
          margin-top: 2px;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .brand-hero {
          position: relative;
          z-index: 2;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 60px 0 20px;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 999px;
          padding: 6px 14px;
          font-size: 12px;
          color: rgba(255,255,255,0.9);
          font-weight: 600;
          letter-spacing: 0.3px;
          width: fit-content;
          margin-bottom: 28px;
          backdrop-filter: blur(4px);
        }

        .hero-badge::before {
          content: '';
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #4ade80;
          box-shadow: 0 0 8px #4ade80;
          animation: blink 2s ease-in-out infinite;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        .hero-title {
          font-size: 42px;
          font-weight: 900;
          color: #fff;
          line-height: 1.1;
          letter-spacing: -1.5px;
          margin-bottom: 20px;
        }

        .hero-title span {
          background: linear-gradient(90deg, #ffb347, #ff6a00);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-desc {
          color: rgba(255,255,255,0.65);
          font-size: 16px;
          line-height: 1.7;
          max-width: 380px;
        }

        .stats-row {
          position: relative;
          z-index: 2;
          display: flex;
          gap: 32px;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .stat-number {
          font-size: 24px;
          font-weight: 900;
          color: #fff;
          letter-spacing: -0.5px;
        }

        .stat-label {
          font-size: 12px;
          color: rgba(255,255,255,0.5);
          font-weight: 500;
        }

        /* ====== RIGHT PANEL (Login) ====== */
        .right-panel {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 60px 48px;
          background: #f6f7fb;
        }

        .login-box {
          width: 100%;
          max-width: 400px;
        }

        .login-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .login-icon {
          width: 64px;
          height: 64px;
          border-radius: 20px;
          background: linear-gradient(135deg, #ff6a00, #ff8a2b);
          display: grid;
          place-items: center;
          margin: 0 auto 20px;
          box-shadow: 0 12px 32px rgba(255,106,0,0.35);
        }

        .login-icon svg {
          width: 28px;
          height: 28px;
          fill: none;
          stroke: #fff;
          stroke-width: 2;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .login-title {
          font-size: 26px;
          font-weight: 900;
          color: #0b0f1a;
          letter-spacing: -0.5px;
          margin-bottom: 8px;
        }

        .login-subtitle {
          color: #667085;
          font-size: 14px;
          line-height: 1.6;
        }

        .btn-group {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 28px;
        }

        .btn-primary {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: linear-gradient(135deg, #ff6a00, #ff8a2b);
          color: #fff;
          font-weight: 700;
          font-size: 15px;
          padding: 14px 24px;
          border-radius: 14px;
          text-decoration: none;
          transition: all 0.2s ease;
          box-shadow: 0 6px 20px rgba(255,106,0,0.30);
          border: none;
          cursor: pointer;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(255,106,0,0.45);
          filter: brightness(1.05);
        }

        .btn-secondary {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: #fff;
          color: #0b0f1a;
          font-weight: 600;
          font-size: 15px;
          padding: 14px 24px;
          border-radius: 14px;
          text-decoration: none;
          border: 1px solid #eaecf0;
          transition: all 0.2s ease;
          box-shadow: 0 2px 8px rgba(16,24,40,0.04);
        }

        .btn-secondary:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(16,24,40,0.08);
          border-color: #d0d5dd;
        }

        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 4px 0;
        }

        .divider-line {
          flex: 1;
          height: 1px;
          background: #eaecf0;
        }

        .divider-text {
          font-size: 12px;
          color: #98a2b3;
          font-weight: 500;
        }

        .features-list {
          border-top: 1px solid #eaecf0;
          padding-top: 24px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          color: #667085;
        }

        .feature-dot {
          width: 20px;
          height: 20px;
          border-radius: 6px;
          background: rgba(255,106,0,0.10);
          display: grid;
          place-items: center;
          flex-shrink: 0;
        }

        .feature-dot svg {
          width: 12px;
          height: 12px;
          fill: none;
          stroke: #ff6a00;
          stroke-width: 2.5;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        /* ====== RESPONSIVE ====== */
        @media (max-width: 860px) {
          .landing-root {
            grid-template-columns: 1fr;
          }
          .left-panel {
            padding: 36px 28px;
            min-height: auto;
          }
          .hero-title {
            font-size: 30px;
          }
          .brand-hero {
            padding: 32px 0 16px;
          }
          .right-panel {
            padding: 40px 28px;
          }
        }
      `}</style>

      <div className="landing-root">
        {/* LEFT — Brand Panel */}
        <div className="left-panel">
          <div className="brand-top">
            <div className="brand-logo">
              <div className="logo-mark">SP</div>
              <div>
                <div className="logo-text">Segantini People</div>
                <div className="logo-sub">Human Capital Management</div>
              </div>
            </div>
          </div>

          <div className="brand-hero">
            <div className="hero-badge">Plataforma de RH inteligente</div>
            <h1 className="hero-title">
              Transforme a gestão de<br />
              <span>pessoas na sua empresa</span>
            </h1>
            <p className="hero-desc">
              Pesquisas de clima, avaliações de desempenho e métricas em tempo real — tudo em um só lugar.
            </p>
          </div>

          <div className="stats-row">
            <div className="stat-item">
              <span className="stat-number">NPS</span>
              <span className="stat-label">Clima em tempo real</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">eNPS</span>
              <span className="stat-label">Engajamento da equipe</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">360°</span>
              <span className="stat-label">Visão completa do RH</span>
            </div>
          </div>
        </div>

        {/* RIGHT — Login Panel */}
        <div className="right-panel">
          <div className="login-box">
            <div className="login-header">
              <div className="login-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <polyline points="10 17 15 12 10 7" />
                  <line x1="15" y1="12" x2="3" y2="12" />
                </svg>
              </div>
              <h2 className="login-title">Bem-vindo de volta</h2>
              <p className="login-subtitle">Acesse sua conta para continuar</p>
            </div>

            <div className="btn-group">
              <Link href="/sign-in" className="btn-primary">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <polyline points="10 17 15 12 10 7" />
                  <line x1="15" y1="12" x2="3" y2="12" />
                </svg>
                Entrar na plataforma
              </Link>

              <div className="divider">
                <div className="divider-line" />
                <span className="divider-text">ou</span>
                <div className="divider-line" />
              </div>

              <Link href="/sign-up" className="btn-secondary">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <line x1="19" y1="8" x2="19" y2="14" />
                  <line x1="22" y1="11" x2="16" y2="11" />
                </svg>
                Criar conta para sua empresa
              </Link>
            </div>

            <div className="features-list">
              {[
                "Pesquisas de clima com resultados instantâneos",
                "Dashboard com NPS e eNPS em tempo real",
                "Gestão completa de colaboradores",
              ].map((f) => (
                <div key={f} className="feature-item">
                  <div className="feature-dot">
                    <svg viewBox="0 0 24 24">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  {f}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
