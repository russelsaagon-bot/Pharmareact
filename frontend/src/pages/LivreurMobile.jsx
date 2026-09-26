import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { livreurService } from "../services/livreurService";

function LivreurMobile() {
    const [activeTab, setActiveTab] = useState("livraisons");
    const [livraisons, setLivraisons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedLivraison, setSelectedLivraison] = useState(null);
    const [showDetail, setShowDetail] = useState(false);
    const [stats, setStats] = useState({
        en_cours: 0,
        a_livrer: 0,
        livrees: 0,
    });
    const { isAuthenticated, isLivreur, user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated || !isLivreur) {
            navigate("/login");
            return;
        }
        loadLivraisons();
    }, [isAuthenticated, isLivreur]);

    const loadLivraisons = async () => {
        setLoading(true);
        setError("");
        try {
            const data = await livreurService.getMesLivraisons();
            setLivraisons(data);
            const enCours = data.filter((l) => l.statut === "en_preparation" || l.statut === "en_route").length;
            const aLivrer = data.filter((l) => l.statut === "en_preparation").length;
            const livrees = data.filter((l) => l.statut === "livree").length;
            setStats({ en_cours: enCours, a_livrer: aLivrer, livrees });
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors du chargement");
        } finally {
            setLoading(false);
        }
    };

    const handleChangerStatut = async (livraison, nouveauStatut) => {
        try {
            await livreurService.changerStatutLivraison(livraison.id_livraison, nouveauStatut);
            await loadLivraisons();
            if (showDetail && selectedLivraison?.id_livraison === livraison.id_livraison) {
                setSelectedLivraison({ ...selectedLivraison, statut: nouveauStatut });
            }
        } catch (err) {
            alert(err.response?.data?.message || "Erreur lors du changement de statut");
        }
    };

    const getStatutLabel = (statut) => {
        const labels = {
            en_attente: "En attente",
            en_preparation: "En préparation",
            en_route: "En route",
            livree: "Livrée",
        };
        return labels[statut] || statut;
    };

    const getStatutColor = (statut) => {
        const colors = {
            en_attente: "bg-amber-100 text-amber-700",
            en_preparation: "bg-blue-100 text-blue-700",
            en_route: "bg-purple-100 text-purple-700",
            livree: "bg-green-100 text-green-700",
        };
        return colors[statut] || "bg-slate-100 text-slate-700";
    };

    const getStatutIcon = (statut) => {
        const icons = {
            en_attente: "⏳",
            en_preparation: "📦",
            en_route: "🛵",
            livree: "✅",
        };
        return icons[statut] || "📦";
    };

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    const filtreLivraisons = livraisons.filter((l) => {
        if (activeTab === "livraisons") return l.statut !== "livree";
        if (activeTab === "terminees") return l.statut === "livree";
        return true;
    });

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-24">
            {/* Header mobile */}
            <header className="sticky top-0 z-40 bg-blue-600 text-white shadow-lg">
                <div className="flex items-center justify-between px-4 py-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 text-xl">
                            🛵
                        </div>
                        <div>
                            <h1 className="text-lg font-bold">Espace Livreur</h1>
                            <p className="text-xs text-blue-100">
                                {user?.nom || "Livreur"} · {stats.en_cours} en cours
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="rounded-xl bg-white/10 px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
                    >
                        Déconnexion
                    </button>
                </div>
            </header>

            {/* Stats rapides */}
            <div className="grid grid-cols-3 gap-3 px-4 py-4">
                <div className="rounded-2xl bg-white p-3 text-center shadow-sm">
                    <p className="text-2xl font-bold text-blue-600">{stats.a_livrer}</p>
                    <p className="mt-1 text-xs font-medium text-slate-500">À livrer</p>
                </div>
                <div className="rounded-2xl bg-white p-3 text-center shadow-sm">
                    <p className="text-2xl font-bold text-purple-600">{stats.en_cours}</p>
                    <p className="mt-1 text-xs font-medium text-slate-500">En cours</p>
                </div>
                <div className="rounded-2xl bg-white p-3 text-center shadow-sm">
                    <p className="text-2xl font-bold text-green-600">{stats.livrees}</p>
                    <p className="mt-1 text-xs font-medium text-slate-500">Livrées</p>
                </div>
            </div>

            {/* Onglets */}
            <div className="flex gap-2 px-4">
                <button
                    onClick={() => setActiveTab("livraisons")}
                    className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                        activeTab === "livraisons"
                            ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                            : "bg-white text-slate-600 hover:bg-slate-100"
                    }`}
                >
                    🚚 Livraisons
                </button>
                <button
                    onClick={() => setActiveTab("terminees")}
                    className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                        activeTab === "terminees"
                            ? "bg-green-600 text-white shadow-lg shadow-green-600/20"
                            : "bg-white text-slate-600 hover:bg-slate-100"
                    }`}
                >
                    ✅ Terminées
                </button>
            </div>

            {/* Contenu */}
            <main className="px-4 py-4">
                {error && (
                    <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {filtreLivraisons.length === 0 ? (
                    <div className="mt-10 text-center">
                        <p className="text-6xl">📭</p>
                        <p className="mt-4 text-lg font-semibold text-slate-700">Aucune livraison</p>
                        <p className="mt-1 text-sm text-slate-500">
                            {activeTab === "livraisons"
                                ? "En attente de nouvelles livraisons..."
                                : "Aucune livraison terminée pour le moment"}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filtreLivraisons.map((livraison) => (
                            <button
                                key={livraison.id_livraison}
                                onClick={() => {
                                    setSelectedLivraison(livraison);
                                    setShowDetail(true);
                                }}
                                className="w-full rounded-2xl border border-slate-100 bg-white p-4 text-left shadow-sm transition hover:shadow-md"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-xl">
                                            {getStatutIcon(livraison.statut)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900">
                                                Commande {livraison.numero_commande || `#${livraison.id_commande}`}
                                            </p>
                                            <p className="mt-0.5 text-xs text-slate-500">
                                                {livraison.client_prenom} {livraison.client_nom}
                                            </p>
                                        </div>
                                    </div>
                                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatutColor(livraison.statut)}`}>
                                        {getStatutLabel(livraison.statut)}
                                    </span>
                                </div>
                                <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                        <span>📍</span>
                                        <span className="line-clamp-1">
                                            {livraison.quartier || "Adresse à confirmer"}
                                        </span>
                                    </div>
                                    <span className="text-sm font-bold text-blue-600">
                                        {Number(livraison.montant_total || 0).toLocaleString("fr-FR")} FCFA
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </main>

            {/* Modal détail livraison */}
            {showDetail && selectedLivraison && (
                <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center">
                    <div className="max-h-[90vh] w-full overflow-y-auto rounded-t-3xl bg-white p-6 sm:max-w-lg sm:rounded-3xl">
                        <div className="flex items-start justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">
                                    Commande {selectedLivraison.numero_commande || `#${selectedLivraison.id_commande}`}
                                </h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    {selectedLivraison.client_prenom} {selectedLivraison.client_nom}
                                </p>
                            </div>
                            <button
                                onClick={() => setShowDetail(false)}
                                className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-200"
                            >
                                ✕ Fermer
                            </button>
                        </div>

                        {/* Statut actuel */}
                        <div className={`mt-4 rounded-xl p-4 ${getStatutColor(selectedLivraison.statut)}`}>
                            <p className="text-sm font-semibold">
                                {getStatutIcon(selectedLivraison.statut)} Statut : {getStatutLabel(selectedLivraison.statut)}
                            </p>
                        </div>

                        {/* Informations client */}
                        <div className="mt-4 space-y-2 rounded-xl bg-slate-50 p-4">
                            <h3 className="text-sm font-bold text-slate-700">Informations client</h3>
                            <p className="text-sm text-slate-600">👤 {selectedLivraison.client_prenom} {selectedLivraison.client_nom}</p>
                            <p className="text-sm text-slate-600">📞 {selectedLivraison.client_telephone || "Non renseigné"}</p>
                            <p className="text-sm text-slate-600">📦 {selectedLivraison.nom_destinataire || "Client"}</p>
                        </div>

                        {/* Adresse de livraison */}
                        <div className="mt-4 space-y-2 rounded-xl bg-slate-50 p-4">
                            <h3 className="text-sm font-bold text-slate-700">Adresse de livraison</h3>
                            <p className="text-sm text-slate-600">🏪 Pharmacie : {selectedLivraison.nom_pharmacie}</p>
                            <p className="text-sm text-slate-600">📍 Quartier : {selectedLivraison.quartier || "Non spécifié"}</p>
                            {selectedLivraison.ville && (
                                <p className="text-sm text-slate-600">🌆 Ville : {selectedLivraison.ville}</p>
                            )}
                            {selectedLivraison.adresse && (
                                <p className="text-sm text-slate-600">🏠 Adresse : {selectedLivraison.adresse}</p>
                            )}
                            {selectedLivraison.instructions && (
                                <div className="mt-2 rounded-lg bg-amber-50 p-3">
                                    <p className="text-xs font-semibold text-amber-700">📝 Instructions :</p>
                                    <p className="mt-1 text-sm text-amber-800">{selectedLivraison.instructions}</p>
                                </div>
                            )}
                        </div>

                        {/* Montant */}
                        <div className="mt-4 flex items-center justify-between rounded-xl bg-blue-50 p-4">
                            <span className="text-sm font-semibold text-blue-700">Montant total</span>
                            <span className="text-lg font-bold text-blue-900">
                                {Number(selectedLivraison.montant_total || 0).toLocaleString("fr-FR")} FCFA
                            </span>
                        </div>

                        {/* Actions selon statut */}
                        <div className="mt-6 space-y-2">
                            {selectedLivraison.statut === "en_preparation" && (
                                <button
                                    onClick={() => handleChangerStatut(selectedLivraison, "en_route")}
                                    className="w-full rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
                                >
                                    🛵 Démarrer la livraison
                                </button>
                            )}
                            {selectedLivraison.statut === "en_route" && (
                                <button
                                    onClick={() => handleChangerStatut(selectedLivraison, "livree")}
                                    className="w-full rounded-xl bg-green-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-green-600/20 transition hover:bg-green-700"
                                >
                                    ✅ Marquer comme livrée
                                </button>
                            )}
                            {selectedLivraison.statut === "en_attente" && (
                                <p className="rounded-xl bg-amber-50 p-4 text-center text-sm font-medium text-amber-700">
                                    ⏳ En attente de préparation à la pharmacie
                                </p>
                            )}
                            {selectedLivraison.statut === "livree" && (
                                <div className="rounded-xl bg-green-50 p-4 text-center">
                                    <p className="text-lg">🎉</p>
                                    <p className="text-sm font-semibold text-green-700">
                                        Livraison terminée avec succès !
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Navigation basse mobile */}
            <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white">
                <div className="grid grid-cols-3 gap-1 px-2 py-2">
                    <button
                        onClick={() => setActiveTab("livraisons")}
                        className={`flex flex-col items-center rounded-xl px-3 py-2 text-xs font-medium transition ${
                            activeTab === "livraisons" ? "bg-blue-50 text-blue-600" : "text-slate-500"
                        }`}
                    >
                        <span className="text-xl">🚚</span>
                        <span className="mt-1">Livraisons</span>
                    </button>
                    <button
                        onClick={() => setActiveTab("terminees")}
                        className={`flex flex-col items-center rounded-xl px-3 py-2 text-xs font-medium transition ${
                            activeTab === "terminees" ? "bg-green-50 text-green-600" : "text-slate-500"
                        }`}
                    >
                        <span className="text-xl">✅</span>
                        <span className="mt-1">Terminées</span>
                    </button>
                    <button
                        onClick={handleLogout}
                        className="flex flex-col items-center rounded-xl px-3 py-2 text-xs font-medium text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                    >
                        <span className="text-xl">🚪</span>
                        <span className="mt-1">Quitter</span>
                    </button>
                </div>
            </nav>
        </div>
    );
}

export default LivreurMobile;