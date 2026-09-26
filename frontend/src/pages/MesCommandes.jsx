import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { clientService } from "../services/clientService";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

function MesCommandes() {
    const [commandes, setCommandes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { isClient } = useAuth();

    useEffect(() => {
        loadCommandes();
    }, []);

    const loadCommandes = async () => {
        try {
            const data = await clientService.getCommandes();
            setCommandes(data);
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors du chargement de vos commandes");
        } finally {
            setLoading(false);
        }
    };

    const getStatutBadge = (statut) => {
        const badges = {
            en_attente: "bg-amber-50 text-amber-700 border-amber-200",
            confirmee: "bg-blue-50 text-blue-700 border-blue-200",
            en_preparation: "bg-indigo-50 text-indigo-700 border-indigo-200",
            prete: "bg-purple-50 text-purple-700 border-purple-200",
            en_cours_de_livraison: "bg-cyan-50 text-cyan-700 border-cyan-200",
            livree: "bg-emerald-50 text-emerald-700 border-emerald-200",
            annulee: "bg-red-50 text-red-700 border-red-200",
        };
        const labels = {
            en_attente: "En attente",
            confirmee: "Confirmée",
            en_preparation: "En préparation",
            prete: "Prête",
            en_cours_de_livraison: "En livraison",
            livree: "Livrée",
            annulee: "Annulée",
        };
        return (
            <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${badges[statut] || "bg-slate-50 text-slate-700 border-slate-200"}`}>
                {labels[statut] || statut}
            </span>
        );
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
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">Mes Commandes</h1>
                    <p className="mt-1 text-sm text-slate-500">Suivez l'historique et l'état de toutes vos commandes</p>
                </div>

                {error && (
                    <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
                        {error}
                    </div>
                )}

                {commandes.length === 0 ? (
                    <div className="rounded-2xl border border-slate-100 bg-white p-12 text-center shadow-sm">
                        <p className="text-4xl">🛍️</p>
                        <h2 className="mt-4 text-lg font-bold text-slate-900">Aucune commande pour le moment</h2>
                        <p className="mt-2 text-slate-500">Parcourez nos pharmacies et passez votre première commande.</p>
                        <Link
                            to="/pharmacies"
                            className="mt-6 inline-block rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
                        >
                            Voir les pharmacies
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {commandes.map((commande) => (
                            <div
                                key={commande.id_commande}
                                className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:shadow-md"
                            >
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3">
                                        <h2 className="text-lg font-bold text-slate-900">
                                            {commande.numero_commande || `#${commande.id_commande}`}
                                        </h2>
                                        {getStatutBadge(commande.statut)}
                                    </div>
                                    <p className="text-sm font-medium text-slate-700">
                                        🏥 {commande.nom_pharmacie || "Pharmacie partenaire"}
                                    </p>
                                    <p className="text-xs text-slate-400">
                                        Commandé le {new Date(commande.date_commande).toLocaleDateString("fr-FR", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit"
                                        })}
                                    </p>
                                </div>

                                <div className="mt-4 flex items-center justify-between sm:mt-0 sm:flex-col sm:items-end sm:gap-3">
                                    <span className="text-lg font-extrabold text-blue-600">
                                        {Number(commande.montant_total).toLocaleString()} FCFA
                                    </span>
                                    <Link
                                        to={`/suivi/${commande.id_commande}`}
                                        className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-600 transition hover:bg-blue-100"
                                    >
                                        Suivre la commande →
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}

export default MesCommandes;
