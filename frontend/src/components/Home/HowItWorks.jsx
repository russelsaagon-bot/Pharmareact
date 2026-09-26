const steps = [
    {
        number: "1",
        title: "Recherchez",
        description:
            "Trouvez vos médicaments et produits de santé grâce à notre recherche intelligente.",
    },
    {
        number: "2",
        title: "Commandez",
        description:
            "Choisissez votre pharmacie partenaire et commandez en quelques clics.",
    },
    {
        number: "3",
        title: "Recevez",
        description:
            "Suivez votre livraison en temps réel et recevez vos produits à domicile.",
    },
];

function HowItWorks() {
    return (
        <section className="bg-white py-16 md:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                        Comment ça marche ?
                    </h2>
                    <p className="mt-4 text-lg text-slate-600">
                        Commandez vos médicaments en 3 étapes simples.
                    </p>
                </div>

                <div className="mt-12 grid gap-8 md:grid-cols-3">
                    {steps.map((step) => (
                        <div
                            key={step.number}
                            className="relative rounded-2xl border border-slate-100 bg-slate-50 p-8 text-center"
                        >
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-2xl font-bold text-white shadow-lg shadow-blue-600/20">
                                {step.number}
                            </div>
                            <h3 className="mt-6 text-xl font-semibold text-slate-900">
                                {step.title}
                            </h3>
                            <p className="mt-3 text-sm leading-6 text-slate-600">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default HowItWorks;