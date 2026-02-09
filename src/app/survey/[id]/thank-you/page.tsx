

export default function ThankYouPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4 text-center">
            <div className="mb-6 grid h-16 w-16 place-items-center rounded-full bg-green-100 text-3xl text-green-600">
                🎉
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Obrigado!</h1>
            <p className="mt-2 max-w-xs text-slate-500">
                Sua resposta foi registrada com sucesso. Agradecemos sua participação.
            </p>

            <div className="mt-8 text-xs text-slate-400">
                Segantini People
            </div>
        </div>
    );
}
