import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { clientService } from "../services/clientService";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

function Panier() {
    const [panier, setPanier] = useState({ articles: [], total: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login");
            return;
        }
        loadPanier();
    }, [isAuthenticated]);

    const loadPanier = async () => {
        try {
            const data = await clientService.getPanier();
            setPanier(data);
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors du chargement du panier");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateQuantity = async (id_medicament, quantite) => {
        if (quantite < 1) return;
        try {
            await clientService.updatePanierItem(id_medicament, quantite);
            await loadPanier();
        } catch (err) {
            alert(err.response?.data?.message || "Erreur lors de la mise à jour");
        }
    };

    const handleRemove = async (id_medicament) => {
        try {
            await clientService.removeFromPanier(id_medicament);
            await loadPanier();
        } catch (err) {
            alert(err.response?.data?.message || "Erreur lors de la suppression");
        }
    };

    const handleClear = async () => {
        if (!window.confirm("Vider le panier ?")) return;
        try {
            await clientService.clearPanier();
            await loadPanier();
        } catch (err) {
            alert(err.response?.data?.message || "Erreur lors du vidage du panier");
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

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
                            Mon panier
                        </h1>
                        <p className="mt-3 text-lg text-slate-600">
                            {panier.articles?.length || 0} article(s) dans votre panier
                        </p>
                    </div>
                    {panier.articles?.length > 0 && (
                        <button
                            onClick={handleClear}
                            className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                        >
                            Vider le panier
                        </button>
                    )}
                </div>

                {error && (
                    <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {!error && panier.articles?.length === 0 ? (
                    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-12 text-center">
                        <p className="text-5xl">🛒</p>
                        <p className="mt-4 text-lg font-semibold text-slate-700">
                            Votre panier est vide
                        </p>
                        <p className="mt-2 text-slate-500">
                            Parcourez nos pharmacies et ajoutez des médicaments
                        </p>
                        <Link
                            to="/medicaments"
                            className="mt-6 inline-block rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
                        >
                            Voir les médicaments
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-8 lg:grid-cols-3">
                        {/* Articles */}
                        <div className="space-y-4 lg:col-span-2">
                            {panier.articles?.map((article) => (
                                <div
                                    key={article.id_medicament}
                                    className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
                                >
                                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-2xl">
                                        {article.image ? (
                                            <img src={article.image} alt={article.nom_medicament} className="h-full w-full rounded-xl object-cover" />
                                        ) : (
                                            "💊"
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-slate-900">
                                            {article.nom_medicament}
                                        </h3>
                                        <p className="mt-1 text-sm text-slate-500">
                                            {Number(article.prix).toLocaleString("fr-FR")} FCFA / unité
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleUpdateQuantity(article.id_medicament, article.quantite - 1)}
                                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50"
                                        >
                                            −
                                        </button>
                                        <span className="w-8 text-center font-semibold text-slate-900">
                                            {article.quantite}
                                        </span>
                                        <button
                                            onClick={() => handleUpdateQuantity(article.id_medicament, article.quantite + 1)}
                                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-blue-600">
                                            {(article.prix * article.quantite).toLocaleString("fr-FR")} FCFA
                                        </p>
                                        <button
                                            onClick={() => handleRemove(article.id_medicament)}
                                            className="mt-1 text-sm text-red-500 hover:text-red-600"
                                        >
                                            Supprimer
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Résumé */}
                        <div className="h-fit rounded-2xl border border-slate-100 bg-slate-50 p-6">
                            <h2 className="text-lg font-bold text-slate-900">Résumé</h2>
                            <div className="mt-4 space-y-3">
                                <div className="flex justify-between text-sm text-slate-600">
                                    <span>Sous-total</span>
                                    <span>{Number(panier.total).toLocaleString("fr-FR")} FCFA</span>
                                </div>
                                <div className="flex justify-between text-sm text-slate-600">
                                    <span>Livraison</span>
                                    <span>Calculée à la commande</span>
                                </div>
                                <div className="border-t border-slate-200 pt-3">
                                    <div className="flex justify-between font-bold text-slate-900">
                                        <span>Total</span>
                                        <span>{Number(panier.total).toLocaleString("fr-FR")} FCFA</span>
                                    </div>
                                </div>
                            </div>
                            <Link
                                to="/commande"
                                className="mt-6 block w-full rounded-xl bg-blue-600 px-6 py-3.5 text-center font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
                            >
                                Passer la commande
                            </Link>
                            <Link
                                to="/medicaments"
                                className="mt-3 block w-full rounded-xl border border-slate-200 bg-white px-6 py-3 text-center font-semibold text-slate-700 transition hover:bg-slate-50"
                            >
                                Continuer mes achats
                            </Link>
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}

export default Panier;