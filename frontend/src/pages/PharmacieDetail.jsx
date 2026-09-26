import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { pharmacieService } from "../services/pharmacieService";
import { medicamentService } from "../services/medicamentService";
import { useAuth } from "../context/AuthContext";
import { clientService } from "../services/clientService";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

function PharmacieDetail() {
    const { id } = useParams();
    const [pharmacie, setPharmacie] = useState(null);
    const [medicaments, setMedicaments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [addedToCart, setAddedToCart] = useState({});
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        try {
            const [pharmaData, medData] = await Promise.all([
                pharmacieService.getById(id),
                medicamentService.getByPharmacie(id),
            ]);
            setPharmacie(pharmaData);
            setMedicaments(medData);
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors du chargement");
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

    if (loading) {
        return (
            <div className="min-h-screen bg-white">
                <Navbar />
                <div className="flex justify-center py-20">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
                </div>
                <Footer />
            </div>
        );
    }

    if (error || !pharmacie) {
        return (
            <div className="min-h-screen bg-white">
                <Navbar />
                <div className="mx-auto max-w-7xl px-4 py-20 text-center">
                    <p className="text-4xl">😕</p>
                    <p className="mt-4 text-lg font-semibold text-slate-700">{error || "Pharmacie introuvable"}</p>
                    <Link to="/pharmacies" className="mt-4 inline-block text-blue-600 hover:underline">
                        Retour aux pharmacies
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
                {/* En-tête pharmacie */}
                <div className="rounded-3xl bg-gradient-to-br from-blue-600 to-blue-800 p-8 text-white sm:p-12">
                    <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
                        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/15 text-4xl">
                            {pharmacie.logo ? (
                                <img src={pharmacie.logo} alt={pharmacie.nom_pharmacie} className="h-full w-full rounded-2xl object-cover" />
                            ) : (
                                "🏥"
                            )}
                        </div>
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold sm:text-4xl">{pharmacie.nom_pharmacie}</h1>
                            <p className="mt-2 text-blue-100">
                                {pharmacie.quartier || pharmacie.adresse} · {pharmacie.ville} {pharmacie.pays ? `, ${pharmacie.pays}` : ""}
                            </p>
                            <div className="mt-4 flex flex-wrap gap-3 text-sm">
                                {pharmacie.telephone && (
                                    <span className="rounded-full bg-white/15 px-4 py-1.5">
                                        📞 {pharmacie.telephone}
                                    </span>
                                )}
                                {pharmacie.email && (
                                    <span className="rounded-full bg-white/15 px-4 py-1.5">
                                        ✉️ {pharmacie.email}
                                    </span>
                                )}
                                {pharmacie.horaires && (
                                    <span className="rounded-full bg-white/15 px-4 py-1.5">
                                        🕐 {pharmacie.horaires}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Médicaments */}
                <div className="mt-12">
                    <h2 className="text-2xl font-bold text-slate-900">
                        Médicaments disponibles
                    </h2>
                    <p className="mt-2 text-slate-600">
                        {medicaments.length} médicament(s) disponible(s) dans cette pharmacie
                    </p>

                    {medicaments.length === 0 ? (
                        <div className="mt-8 rounded-2xl border border-slate-100 bg-slate-50 p-12 text-center">
                            <p className="text-4xl">💊</p>
                            <p className="mt-4 text-lg font-semibold text-slate-700">
                                Aucun médicament disponible
                            </p>
                        </div>
                    ) : (
                        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
                                    {med.description && (
                                        <p className="mt-1 line-clamp-2 text-sm text-slate-500">
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
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default PharmacieDetail;