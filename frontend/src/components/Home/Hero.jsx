function Hero() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/50 to-white">
            {/* Décorations de fond */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl" />
                <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-green-200/30 blur-3xl" />
            </div>

            <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-2 lg:py-28">
                {/* Texte */}
                <div className="text-center lg:text-left">
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 shadow-sm">
                        <span className="h-2 w-2 rounded-full bg-green-500" />
                        <span className="text-sm font-medium text-slate-600">
                            Des pharmacies à votre service
                        </span>
                    </div>

                    <h1 className="mx-auto max-w-2xl text-4xl font-bold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:mx-0 lg:text-6xl">
                        Votre santé,
                        <span className="block text-blue-600">plus simple.</span>
                    </h1>

                    <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg lg:mx-0">
                        Recherchez vos médicaments, trouvez une pharmacie proche
                        de vous, commandez en quelques clics et suivez votre
                        livraison directement depuis PharmaReact.
                    </p>

                    <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
                        <button className="rounded-xl bg-blue-600 px-7 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700">
                            Rechercher un médicament
                        </button>
                        <button className="rounded-xl border border-slate-200 bg-white px-7 py-3.5 font-semibold text-slate-700 transition hover:bg-slate-50">
                            Découvrir les pharmacies
                        </button>
                    </div>

                    {/* Statistiques */}
                    <div className="mt-10 flex flex-wrap items-center justify-center gap-6 lg:justify-start">
                        <div>
                            <p className="text-2xl font-bold text-slate-900">24/7</p>
                            <p className="text-sm text-slate-500">Accès à la plateforme</p>
                        </div>
                        <div className="h-10 w-px bg-slate-200" />
                        <div>
                            <p className="text-2xl font-bold text-slate-900">Rapide</p>
                            <p className="text-sm text-slate-500">Commande simplifiée</p>
                        </div>
                        <div className="h-10 w-px bg-slate-200" />
                        <div>
                            <p className="text-2xl font-bold text-slate-900">Sécurisé</p>
                            <p className="text-sm text-slate-500">Paiement protégé</p>
                        </div>
                    </div>
                </div>

                {/* Visuel */}
                <div className="relative mx-auto w-full max-w-md lg:max-w-none">
                    <div className="relative rounded-[2rem] border border-white bg-white p-4 shadow-2xl shadow-slate-200">
                        <div className="rounded-[1.5rem] bg-gradient-to-br from-blue-600 to-blue-800 p-6 sm:p-8">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-blue-100">PharmaReact</p>
                                    <p className="mt-1 text-xl font-bold text-white sm:text-2xl">
                                        Votre pharmacie
                                    </p>
                                </div>
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 text-2xl">
                                    +
                                </div>
                            </div>

                            <div className="mt-8 rounded-2xl bg-white p-5">
                                <p className="text-sm text-slate-500">Recherche</p>
                                <div className="mt-3 flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
                                    <span>⌕</span>
                                    <span className="text-sm text-slate-400">
                                        Rechercher un médicament...
                                    </span>
                                </div>

                                <div className="mt-5 grid grid-cols-2 gap-3">
                                    <div className="rounded-xl bg-blue-50 p-4">
                                        <p className="text-2xl">💊</p>
                                        <p className="mt-2 text-sm font-semibold text-slate-800">
                                            Médicaments
                                        </p>
                                    </div>
                                    <div className="rounded-xl bg-green-50 p-4">
                                        <p className="text-2xl">🏥</p>
                                        <p className="mt-2 text-sm font-semibold text-slate-800">
                                            Pharmacies
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Hero;