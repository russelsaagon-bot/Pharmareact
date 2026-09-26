function CTA() {
    return (
        <section className="bg-white py-16 md:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-blue-800 px-6 py-16 text-center sm:px-12 md:py-20">
                    {/* Décorations */}
                    <div className="pointer-events-none absolute inset-0">
                        <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
                        <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
                    </div>

                    <div className="relative mx-auto max-w-2xl">
                        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                            Prêt à simplifier votre santé ?
                        </h2>
                        <p className="mt-4 text-lg text-blue-100">
                            Créez votre compte gratuitement et commandez vos
                            médicaments en quelques minutes.
                        </p>
                        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                            <button className="rounded-xl bg-white px-8 py-3.5 font-semibold text-green-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-50">
                                Créer un compte
                            </button>
                            <button className="rounded-xl border border-white/30 bg-white/10 px-8 py-3.5 font-semibold text-white backdrop-blur transition hover:bg-white/20">
                                En savoir plus
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default CTA;