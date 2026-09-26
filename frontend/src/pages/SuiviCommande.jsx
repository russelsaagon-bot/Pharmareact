import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { commandeService } from "../services/commandeService";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const statutConfig = {
    en_attente: { label: "En attente", color: "bg-amber-100 text-amber-700", icon: "⏳" },
    confirmee: { label: "Confirmée", color: "bg-blue-100 text-blue-700", icon: "📋" },
    en_preparation: { label: "En préparation", color: "bg-purple-100 text-purple-700", icon: "🔧" },
    en_livraison: { label: "En livraison", color: "bg-indigo-100 text-indigo-700", icon: "🚚" },
    livree: { label: "Livrée", color: "bg-green-100 text-green-700", icon: "✅" },
    annulee: { label: "Annulée", color: "bg-red-100 text-red-700", icon: "❌" },
};

function SuiviCommande() {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { isAuthenticated } = useAuth();
    

    useEffect(() => {
        if (!isAuthenticated) {
            window.location.href = "/login";
            return;
        }
        loadSuivi();
    }, [id, isAuthenticated]);

    const loadSuivi = async () => {
        try {
            const result = await commandeService.suivre(id);
            setData(result);
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors du chargement du suivi");
        } finally {
            setLoading(false);
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

    if (error || !data) {
        return (
            <div className="min-h-screen bg-white">
                <Navbar />
                <div className="mx-auto max-w-7xl px-4 py-20 text-center">
                    <p className="text-4xl">😕</p>
                    <p className="mt-4 text-lg font-semibold text-slate-700">{error || "Commande introuvable"}</p>
                    <Link to="/" className="mt-4 inline-block text-blue-600 hover:underline">
                        Retour à l'accueil
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    const commande = data.commande;
    const livraison = data.livraison;
    const paiement = data.paiement;
    const statut = statutConfig[commande.statut] || statutConfig.en_attente;

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
                        Suivi de commande
                    </h1>
                    <p className="mt-3 text-lg text-slate-600">
                        Commande {commande.numero_commande}
                    </p>
                </div>

                {/* Statut */}
                <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500">Statut actuel</p>
                            <div className={`mt-2 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${statut.color}`}>
                                <span>{statut.icon}</span>
                                {statut.label}
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-slate-500">Montant total</p>
                            <p className="mt-1 text-xl font-bold text-blue-600">
                                {Number(commande.montant_total).toLocaleString("fr-FR")} FCFA
                            </p>
                        </div>
                    </div>

                    {/* Barre de progression */}
                    <div className="mt-8">
                        <div className="flex items-center justify-between">
                            {["en_attente", "confirmee", "en_preparation", "en_livraison", "livree"].map((step, index) => {
                                const currentIndex = ["en_attente", "confirmee", "en_preparation", "en_livraison", "livree"].indexOf(commande.statut);
                                const isActive = index <= currentIndex;
                                const isCurrent = index === currentIndex;
                                return (
                                    <div key={step} className="flex flex-1 items-center">
                                        <div className="flex flex-col items-center">
                                            <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition ${
                                                isActive ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400"
                                            } ${isCurrent ? "ring-4 ring-blue-100" : ""}`}>
                                                {isActive ? "✓" : index + 1}
                                            </div>
                                            <span className={`mt-2 text-xs font-medium ${isActive ? "text-blue-600" : "text-slate-400"}`}>
                                                {statutConfig[step].label}
                                            </span>
                                        </div>
                                        {index < 4 && (
                                            <div className={`mx-2 h-0.5 flex-1 ${index < currentIndex ? "bg-blue-600" : "bg-slate-200"}`} />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Détails */}
                <div className="mt-8 grid gap-6 md:grid-cols-2">
                    {/* Pharmacie */}
                    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-slate-900">Pharmacie</h2>
                        <div className="mt-4">
                            <p className="font-semibold text-slate-800">{commande.nom_pharmacie}</p>
                            {commande.adresse_pharmacie && (
                                <p className="mt-1 text-sm text-slate-500">{commande.adresse_pharmacie}</p>
                            )}
                        </div>
                    </div>

                    {/* Livraison */}
                    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-slate-900">Livraison</h2>
                        {livraison ? (
                            <div className="mt-4">
                                <p className="font-semibold text-slate-800">
                                    {livraison.nom_livreur} {livraison.prenom_livreur}
                                </p>
                                {livraison.telephone_livreur && (
                                    <p className="mt-1 text-sm text-slate-500">📞 {livraison.telephone_livreur}</p>
                                )}
                                <p className="mt-2 text-sm text-slate-500">
                                    Statut : {livraison.statut || "En attente"}
                                </p>
                            </div>
                        ) : (
                            <p className="mt-4 text-sm text-slate-500">
                                Livraison non encore assignée
                            </p>
                        )}
                    </div>

                    {/* Paiement */}
                    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-slate-900">Paiement</h2>
                        {paiement ? (
                            <div className="mt-4">
                                <p className="font-semibold text-slate-800">
                                    {paiement.methode || "Méthode non spécifiée"}
                                </p>
                                <p className="mt-1 text-sm text-slate-500">
                                    Statut : {paiement.statut || "En attente"}
                                </p>
                                {paiement.reference_transaction && (
                                    <p className="mt-1 text-sm text-slate-500">
                                        Réf : {paiement.reference_transaction}
                                    </p>
                                )}
                            </div>
                        ) : (
                            <p className="mt-4 text-sm text-slate-500">
                                Paiement non encore effectué
                            </p>
                        )}
                    </div>

                    {/* Mode de réception */}
                    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-slate-900">Mode de réception</h2>
                        <div className="mt-4">
                            <p className="font-semibold text-slate-800">
                                {commande.mode_reception === "livraison" ? "🚚 Livraison" : "🏪 Retrait en pharmacie"}
                            </p>
                            <p className="mt-1 text-sm text-slate-500">
                                Date : {new Date(commande.date_commande).toLocaleDateString("fr-FR")}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <Link
                        to="/"
                        className="inline-block rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
                    >
                        Retour à l'accueil
                    </Link>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default SuiviCommande;