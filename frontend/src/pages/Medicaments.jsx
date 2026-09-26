import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { medicamentService } from "../services/medicamentService";
import { categorieService } from "../services/categorieService";
import { pharmacieService } from "../services/pharmacieService";
import { useAuth } from "../context/AuthContext";
import { clientService } from "../services/clientService";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

function Medicaments() {
    const [medicaments, setMedicaments] = useState([]);
    const [categories, setCategories] = useState([]);
    const [pharmacies, setPharmacies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [addedToCart, setAddedToCart] = useState({});
    const { isAuthenticated } = useAuth();
    const [searchParams] = useSearchParams();

    // Filtres
    const [search, setSearch] = useState("");
    const [categorie, setCategorie] = useState(searchParams.get("categorie") || "");
    const [pharmacie, setPharmacie] = useState("");
    const [prixMin, setPrixMin] = useState("");
    const [prixMax, setPrixMax] = useState("");

    useEffect(() => {
        loadInitialData();
    }, []);

    useEffect(() => {
        if (searchParams.get("categorie")) {
            setCategorie(searchParams.get("categorie"));
            const params = { categorie: searchParams.get("categorie") };
            medicamentService.rechercher(params)
                .then(setMedicaments)
                .catch((err) => setError(err.response?.data?.message || "Erreur lors de la recherche"))
                .finally(() => setLoading(false));
        }
    }, [searchParams]);

    const loadInitialData = async () => {
        try {
            const [cats, pharms] = await Promise.all([
                categorieService.getAll(),
                pharmacieService.getAll(),
            ]);
            setCategories(cats);
            setPharmacies(pharms);
        } catch (err) {
            console.error("Erreur chargement filtres:", err);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const params = {};
            if (search) params.q = search;
            if (categorie) params.categorie = categorie;
            if (pharmacie) params.pharmacie = pharmacie;
            if (prixMin) params.prix_min = prixMin;
            if (prixMax) params.prix_max = prixMax;

            const data = await medicamentService.rechercher(params);
            setMedicaments(data);
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la recherche");
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async (medicament) => {
        if (!isAuthenticated) {
            window.location.href = "/login";
            return;
        }
        try {
            await clientService.addToPanier(medicament.id_medicament, 1);
            setAddedToCart({ ...addedToCart, [medicament.id_medicament]: true });
            setTimeout(() => {
                setAddedToCart((prev) => ({ ...prev, [medicament.id_medicament]: false }));
            }, 2000);
        } catch (err) {
            alert(err.response?.data?.message || "Erreur lors de l'ajout au panier");
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
                        Rechercher des médicaments
                    </h1>
                    <p className="mt-3 text-lg text-slate-600">
                        Trouvez vos médicaments dans toutes les pharmacies partenaires
                    </p>
                </div>

                {/* Filtres */}
                <form onSubmit={handleSearch} className="mb-8 rounded-2xl border border-slate-100 bg-slate-50 p-6">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                        <div className="lg:col-span-2">
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                Recherche
                            </label>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Nom du médicament..."
                                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                Catégorie
                            </label>
                            <select
                                value={categorie}
                                onChange={(e) => setCategorie(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            >
                                <option value="">Toutes</option>
                                {categories.map((c) => (
                                    <option key={c.id_categorie} value={c.id_categorie}>
                                        {c.nom_categorie}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                Pharmacie
                            </label>
                            <select
                                value={pharmacie}
                                onChange={(e) => setPharmacie(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            >
                                <option value="">Toutes</option>
                                {pharmacies.map((p) => (
                                    <option key={p.id_pharmacie} value={p.id_pharmacie}>
                                        {p.nom_pharmacie}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-end gap-2">
                            <input
                                type="number"
                                value={prixMin}
                                onChange={(e) => setPrixMin(e.target.value)}
                                placeholder="Prix min"
                                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                            <input
                                type="number"
                                value={prixMax}
                                onChange={(e) => setPrixMax(e.target.value)}
                                placeholder="Prix max"
                                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                        <button
                            type="submit"
                            className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                        >
                            Rechercher
                        </button>
                    </div>
                </form>

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
                        {medicaments.length === 0 ? (
                            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-12 text-center">
                                <p className="text-4xl">💊</p>
                                <p className="mt-4 text-lg font-semibold text-slate-700">
                                    Aucun médicament trouvé
                                </p>
                                <p className="mt-2 text-slate-500">
                                    Essayez de modifier vos critères de recherche
                                </p>
                            </div>
                        ) : (
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {medicaments.map((med) => (
                                    <div
                                        key={med.id_medicament}
                                        className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                                    >
                                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-3xl">
                                            {med.image ? (
                                                <img src={med.image} alt={med.nom_medicament} className="h-full w-full rounded-2xl object-cover" />
                                            ) : (
                                                "💊"
                                            )}
                                        </div>
                                        <h3 className="mt-4 font-semibold text-slate-900">
                                            {med.nom_medicament}
                                        </h3>
                                        {med.nom_categorie && (
                                            <p className="mt-1 text-sm text-slate-500">
                                                {med.nom_categorie}
                                            </p>
                                        )}
                                        {med.nom_pharmacie && (
                                            <p className="mt-1 text-xs text-slate-400">
                                                🏥 {med.nom_pharmacie}
                                            </p>
                                        )}
                                        {med.description && (
                                            <p className="mt-2 line-clamp-2 text-sm text-slate-500">
                                                {med.description}
                                            </p>
                                        )}
                                        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                                            <span className="font-bold text-blue-600">
                                                {Number(med.prix).toLocaleString("fr-FR")} FCFA
                                            </span>
                                            <button
                                                onClick={() => handleAddToCart(med)}
                                                className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                                                    addedToCart[med.id_medicament]
                                                        ? "bg-green-600 text-white"
                                                        : "bg-blue-600 text-white hover:bg-blue-700"
                                                }`}
                                            >
                                                {addedToCart[med.id_medicament] ? "✓ Ajouté" : "Ajouter"}
                                            </button>
                                        </div>
                                    </div>
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

export default Medicaments;