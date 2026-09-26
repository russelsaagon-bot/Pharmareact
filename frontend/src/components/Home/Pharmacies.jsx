import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { pharmacieService } from "../../services/pharmacieService";

function Pharmacies() {
    const [pharmacies, setPharmacies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPharmacies();
    }, []);

    const loadPharmacies = async () => {
        try {
            const data = await pharmacieService.getAll();
            setPharmacies(data.slice(0, 3));
        } catch (err) {
            console.error("Erreur chargement pharmacies:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="bg-slate-50 py-16 md:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                            Pharmacies partenaires
                        </h2>
                        <p className="mt-4 text-lg text-slate-600">
                            Des pharmacies de confiance proches de vous.
                        </p>
                    </div>
                    <Link
                        to="/pharmacies"
                        className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                        Voir toutes les pharmacies
                    </Link>
                </div>

                {loading ? (
                    <div className="mt-12 flex justify-center py-10">
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
                    </div>
                ) : (
                    <div className="mt-12 grid gap-6 md:grid-cols-3">
                        {pharmacies.map((pharmacy) => (
                            <Link
                                key={pharmacy.id_pharmacie}
                                to={`/pharmacies/${pharmacy.id_pharmacie}`}
                                className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl">
                                        {pharmacy.logo ? (
                                            <img src={pharmacy.logo} alt={pharmacy.nom_pharmacie} className="h-full w-full rounded-xl object-cover" />
                                        ) : (
                                            "🏥"
                                        )}
                                    </div>
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                                        <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                                        Active
                                    </span>
                                </div>

                                <h3 className="mt-4 text-lg font-semibold text-slate-900">
                                    {pharmacy.nom_pharmacie}
                                </h3>
                                <p className="mt-1 text-sm text-slate-500">
                                    {pharmacy.quartier || pharmacy.adresse || "Adresse non renseignée"}
                                </p>
                                <p className="mt-1 text-sm text-slate-500">
                                    {pharmacy.ville} {pharmacy.pays ? `, ${pharmacy.pays}` : ""}
                                </p>

                                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                                    <span className="text-sm text-slate-500">
                                        {pharmacy.telephone || "Tél. non renseigné"}
                                    </span>
                                    <span className="text-sm font-semibold text-blue-600">
                                        Voir →
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

export default Pharmacies;