const features = [
    {
        icon: "🔍",
        title: "Recherche intelligente",
        description:
            "Trouvez vos médicaments en quelques secondes grâce à notre moteur de recherche intelligent.",
    },
    {
        icon: "📍",
        title: "Pharmacies proches",
        description:
            "Localisez les pharmacies autour de vous et vérifiez leurs horaires et disponibilités.",
    },
    {
        icon: "🛒",
        title: "Commande en ligne",
        description:
            "Commandez vos médicaments en quelques clics et payez en toute sécurité.",
    },
    {
        icon: "🚚",
        title: "Livraison rapide",
        description:
            "Suivez votre commande en temps réel et recevez vos médicaments à domicile.",
    },
];

function Features() {
    return (
        <section className="bg-white py-16 md:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                        Tout ce dont vous avez besoin
                    </h2>
                    <p className="mt-4 text-lg text-slate-600">
                        Une plateforme complète pour gérer votre santé et vos
                        médicaments en toute simplicité.
                    </p>
                </div>

                <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {features.map((feature) => (
                        <div
                            key={feature.title}
                            className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl transition group-hover:bg-blue-100">
                                {feature.icon}
                            </div>
                            <h3 className="mt-4 text-lg font-semibold text-slate-900">
                                {feature.title}
                            </h3>
                            <p className="mt-2 text-sm leading-6 text-slate-600">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Features;