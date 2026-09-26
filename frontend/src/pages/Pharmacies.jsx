import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { pharmacieService } from "../services/pharmacieService";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

function Pharmacies() {
    const [pharmacies, setPharmacies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");

    useEffect(() => {
        loadPharmacies();
    }, []);

    const loadPharmacies = async () => {
        try {
            const data = await pharmacieService.getAll();
            setPharmacies(data);
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors du chargement des pharmacies");
        } finally {
            setLoading(false);
        }
    };

    const filteredPharmacies = pharmacies.filter((p) => {
        const q = search.toLowerCase();
        return (
            p.nom_pharmacie?.toLowerCase().includes(q) ||
            p.ville?.toLowerCase().includes(q) ||
            p.quartier?.toLowerCase().includes(q) ||
            p.adresse?.toLowerCase().includes(q)
        );
    });

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
                        Nos pharmacies partenaires
                    </h1>
                    <p className="mt-3 text-lg text-slate-600">
                        Trouvez une pharmacie proche de vous
                    </p>
                </div>

                <div className="mb-8">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Rechercher par nom, ville, quartier..."
                        className="w-full max-w-xl rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                </div>

                {loading && (
                    <div className="flex justify-center py-20">
                        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
                    </div>
                )}

                {error && (
                    <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {!loading && !error && (
                    <>
                        {filteredPharmacies.length === 0 ? (
                            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-12 text-center">
                                <p className="text-4xl">🏥</p>
                                <p className="mt-4 text-lg font-semibold text-slate-700">
                                    Aucune pharmacie trouvée
                                </p>
                                <p className="mt-2 text-slate-500">
                                    Essayez de modifier votre recherche
                                </p>
                            </div>
                        ) : (
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {filteredPharmacies.map((pharmacy) => (
                                    <Link
                                        key={pharmacy.id_pharmacie}
                                        to={`/pharmacies/${pharmacy.id_pharmacie}`}
                                        className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-2xl">
                                                {pharmacy.logo ? (
                                                    <img
                                                        src={pharmacy.logo}
                                                        alt={pharmacy.nom_pharmacie}
                                                        className="h-full w-full rounded-xl object-cover"
                                                    />
                                                ) : (
                                                    "🏥"
                                                )}
                                            </div>
                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                                                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                                                Active
                                            </span>
                                        </div>

                                        <h3 className="mt-4 text-lg font-semibold text-slate-900 group-hover:text-blue-600">
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
                    </>
                )}
            </main>
            <Footer />
        </div>
    );
}

export default Pharmacies;