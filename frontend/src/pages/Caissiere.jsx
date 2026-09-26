import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { commandeService } from "../services/commandeService";
import { medicamentService } from "../services/medicamentService";
import { paiementService } from "../services/paiementService";
import { caissiereService } from "../services/caissiereService";

function Caissiere() {
    const [activeTab, setActiveTab] = useState("commandes");
    const [commandes, setCommandes] = useState([]);
    const [medicaments, setMedicaments] = useState([]);
    const [paiements, setPaiements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedCommande, setSelectedCommande] = useState(null);
    const [showDetail, setShowDetail] = useState(false);
    const [caissiereInfo, setCaissiereInfo] = useState(null);
    const [stats, setStats] = useState({
        en_attente: 0,
        pretes: 0,
        encaissements: 0,
    });
    const { isAuthenticated, isCaissiere, user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated || !isCaissiere) {
            navigate("/login");
            return;
        }
        loadData();
    }, [isAuthenticated, isCaissiere]);

    const loadData = async () => {
        setLoading(true);
        setError("");
        try {
            // Récupérer les infos de la caissière
            let idPharmacie = user?.id_pharmacie;
            try {
                const me = await caissiereService.getMe();
                setCaissiereInfo(me);
                if (me.id_pharmacie) idPharmacie = me.id_pharmacie;
            } catch {
                // Ignorer si pas trouvé
            }

            if (idPharmacie) {
                const [commandesData, medsData] = await Promise.all([
                    commandeService.getByPharmacie(idPharmacie),
                    medicamentService.getByPharmacie(idPharmacie),
                ]);
                setCommandes(commandesData);
                setMedicaments(medsData);

                const enAttente = commandesData.filter((c) => c.statut === "en_attente" || c.statut === "confirmee").length;
                const pretes = commandesData.filter((c) => c.statut === "prete").length;
                const encaissements = commandesData.filter((c) => c.statut === "livree" || c.statut === "prete").length;
                setStats({ en_attente: enAttente, pretes: pretes, encaissements });
            }

            try {
                const paiementsData = await paiementService.getAll();
                setPaiements(paiementsData);
            } catch {
                // Ignorer si la route paiements n'existe pas
            }
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors du chargement");
        } finally {
            setLoading(false);
        }
    };

    const handleChangerStatut = async (idCommande, nouveauStatut) => {
        try {
            await commandeService.changerStatut(idCommande, nouveauStatut);
            await loadData();
            if (showDetail && selectedCommande?.id_commande === idCommande) {
                setSelectedCommande({ ...selectedCommande, statut: nouveauStatut });
            }
        } catch (err) {
            alert(err.response?.data?.message || "Erreur lors du changement de statut");
        }
    };

    const getStatutLabel = (statut) => {
        const labels = {
            en_attente: "En attente",
            confirmee: "Confirmée",
            en_preparation: "En préparation",
            prete: "Prête",
            en_livraison: "En livraison",
            livree: "Livrée",
            annulee: "Annulée",
        };
        return labels[statut] || statut;
    };

    const getStatutColor = (statut) => {
        const colors = {
            en_attente: "bg-amber-100 text-amber-700",
            confirmee: "bg-blue-100 text-blue-700",
            en_preparation: "bg-purple-100 text-purple-700",
            prete: "bg-green-100 text-green-700",
            en_livraison: "bg-indigo-100 text-indigo-700",
            livree: "bg-emerald-100 text-emerald-700",
            annulee: "bg-red-100 text-red-700",
        };
        return colors[statut] || "bg-slate-100 text-slate-700";
    };

    const getStatutIcon = (statut) => {
        const icons = {
            en_attente: "⏳",
            confirmee: "✅",
            en_preparation: "🍳",
            prete: "📦",
            en_livraison: "🛵",
            livree: "🎉",
            annulee: "❌",
        };
        return icons[statut] || "📋";
    };

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    const handleEncaisser = async (commande) => {
        if (!window.confirm(`Encaisser la commande ${commande.numero_commande} ?`)) return;
        try {
            // Marquer la commande comme payée / livrée selon le mode
            if (commande.mode_reception === "retrait") {
                await handleChangerStatut(commande.id_commande, "livree");
            } else {
                await handleChangerStatut(commande.id_commande, "en_livraison");
            }
        } catch (err) {
            alert(err.response?.data?.message || "Erreur lors de l'encaissement");
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-teal-600 border-t-transparent" />
            </div>
        );
    }

    const tabs = [
        { id: "commandes", label: "Commandes", icon: "📋" },
        { id: "retraits", label: "Retraits", icon: "🏪" },
        { id: "paiements", label: "Paiements", icon: "💳" },
        { id: "inventaire", label: "Inventaire", icon: "📦" },
    ];

    const commandesRetrait = commandes.filter((c) => c.mode_reception === "retrait" && c.statut !== "livree" && c.statut !== "annulee");
    const commandesLivraison = commandes.filter((c) => c.mode_reception === "livraison" && c.statut !== "livree" && c.statut !== "annulee");

    return (
        <div className="min-h-screen bg-slate-50 pb-8">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-teal-600 text-white shadow-lg">
                <div className="flex items-center justify-between px-4 py-4 sm:px-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 text-xl">
                            💰
                        </div>
                        <div>
                            <h1 className="text-lg font-bold">Espace Caissière</h1>
                            <p className="text-xs text-teal-100">
                                {caissiereInfo?.prenom || user?.nom || "Caissière"} · Pharmacie
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

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 px-4 py-4 sm:px-6">
                <div className="rounded-2xl bg-white p-4 text-center shadow-sm">
                    <p className="text-2xl font-bold text-amber-600">{stats.en_attente}</p>
                    <p className="mt-1 text-xs font-medium text-slate-500">À traiter</p>
                </div>
                <div className="rounded-2xl bg-white p-4 text-center shadow-sm">
                    <p className="text-2xl font-bold text-green-600">{stats.pretes}</p>
                    <p className="mt-1 text-xs font-medium text-slate-500">Prêtes</p>
                </div>
                <div className="rounded-2xl bg-white p-4 text-center shadow-sm">
                    <p className="text-2xl font-bold text-blue-600">{stats.encaissements}</p>
                    <p className="mt-1 text-xs font-medium text-slate-500">Encaissements</p>
                </div>
            </div>

            {/* Onglets */}
            <div className="flex gap-2 overflow-x-auto px-4 pb-4 sm:px-6">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                            activeTab === tab.id
                                ? "bg-teal-600 text-white shadow-lg shadow-teal-600/20"
                                : "bg-white text-slate-600 hover:bg-slate-100"
                        }`}
                    >
                        <span className="mr-2">{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Contenu */}
            <main className="px-4 sm:px-6">
                {error && (
                    <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {/* Commandes */}
                {activeTab === "commandes" && (
                    <div className="space-y-3">
                        {commandesLivraison.length === 0 ? (
                            <div className="mt-10 text-center">
                                <p className="text-6xl">📭</p>
                                <p className="mt-4 text-lg font-semibold text-slate-700">Aucune commande en attente</p>
                            </div>
                        ) : (
                            commandesLivraison.map((commande) => (
                                <div key={commande.id_commande} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-xl">
                                                {getStatutIcon(commande.statut)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900">{commande.numero_commande}</p>
                                                <p className="mt-0.5 text-xs text-slate-500">
                                                    {commande.nom} {commande.prenom}
                                                </p>
                                            </div>
                                        </div>
                                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatutColor(commande.statut)}`}>
                                            {getStatutLabel(commande.statut)}
                                        </span>
                                    </div>
                                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                            <span>🚚</span>
                                            <span>Livraison</span>
                                        </div>
                                        <span className="text-sm font-bold text-teal-600">
                                            {Number(commande.montant_total || 0).toLocaleString("fr-FR")} FCFA
                                        </span>
                                    </div>
                                    <div className="mt-3 flex gap-2">
                                        <select
                                            value={commande.statut}
                                            onChange={(e) => handleChangerStatut(commande.id_commande, e.target.value)}
                                            className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-teal-500"
                                        >
                                            <option value="en_attente">En attente</option>
                                            <option value="confirmee">Confirmée</option>
                                            <option value="en_preparation">En préparation</option>
                                            <option value="prete">Prête</option>
                                            <option value="en_livraison">En livraison</option>
                                            <option value="livree">Livrée</option>
                                            <option value="annulee">Annulée</option>
                                        </select>
                                        {commande.statut === "prete" && (
                                            <button
                                                onClick={() => handleEncaisser(commande)}
                                                className="rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-700"
                                            >
                                                💳 Encaisser
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* Retraits */}
                {activeTab === "retraits" && (
                    <div className="space-y-3">
                        {commandesRetrait.length === 0 ? (
                            <div className="mt-10 text-center">
                                <p className="text-6xl">🏪</p>
                                <p className="mt-4 text-lg font-semibold text-slate-700">Aucun retrait en attente</p>
                            </div>
                        ) : (
                            commandesRetrait.map((commande) => (
                                <div key={commande.id_commande} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-xl">
                                                🏪
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900">{commande.numero_commande}</p>
                                                <p className="mt-0.5 text-xs text-slate-500">
                                                    {commande.nom} {commande.prenom}
                                                </p>
                                            </div>
                                        </div>
                                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatutColor(commande.statut)}`}>
                                            {getStatutLabel(commande.statut)}
                                        </span>
                                    </div>
                                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
                                        <span className="text-sm text-slate-600">Mode : Retrait en pharmacie</span>
                                        <span className="text-sm font-bold text-amber-600">
                                            {Number(commande.montant_total || 0).toLocaleString("fr-FR")} FCFA
                                        </span>
                                    </div>
                                    <div className="mt-3 flex gap-2">
                                        <select
                                            value={commande.statut}
                                            onChange={(e) => handleChangerStatut(commande.id_commande, e.target.value)}
                                            className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-teal-500"
                                        >
                                            <option value="en_attente">En attente</option>
                                            <option value="confirmee">Confirmée</option>
                                            <option value="en_preparation">En préparation</option>
                                            <option value="prete">Prête</option>
                                            <option value="livree">Livrée</option>
                                            <option value="annulee">Annulée</option>
                                        </select>
                                        {commande.statut === "prete" && (
                                            <button
                                                onClick={() => handleEncaisser(commande)}
                                                className="rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-700"
                                            >
                                                💳 Encaisser
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* Paiements */}
                {activeTab === "paiements" && (
                    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6">
                        <h2 className="text-lg font-bold text-slate-900">Historique des paiements</h2>
                        {paiements.length === 0 ? (
                            <p className="mt-4 text-sm text-slate-500">Aucun paiement enregistré</p>
                        ) : (
                            <div className="mt-4 overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="border-b border-slate-200">
                                            <th className="pb-3 pr-4 font-semibold text-slate-700">N°</th>
                                            <th className="pb-3 pr-4 font-semibold text-slate-700">Méthode</th>
                                            <th className="pb-3 pr-4 font-semibold text-slate-700">Montant</th>
                                            <th className="pb-3 font-semibold text-slate-700">Statut</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paiements.map((paiement) => (
                                            <tr key={paiement.id_paiement} className="border-b border-slate-100">
                                                <td className="py-3 pr-4 font-medium text-slate-900">{paiement.numero_commande || `#${paiement.id_commande}`}</td>
                                                <td className="py-3 pr-4 text-slate-600">{paiement.methode_paiement || "-"}</td>
                                                <td className="py-3 pr-4 font-semibold text-teal-600">
                                                    {Number(paiement.montant || 0).toLocaleString("fr-FR")} FCFA
                                                </td>
                                                <td className="py-3">
                                                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                                                        {paiement.statut || "Payé"}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* Inventaire */}
                {activeTab === "inventaire" && (
                    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6">
                        <h2 className="text-lg font-bold text-slate-900">Inventaire des médicaments</h2>
                        {medicaments.length === 0 ? (
                            <p className="mt-4 text-sm text-slate-500">Aucun médicament disponible</p>
                        ) : (
                            <div className="mt-4 overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="border-b border-slate-200">
                                            <th className="pb-3 pr-4 font-semibold text-slate-700">Médicament</th>
                                            <th className="pb-3 pr-4 font-semibold text-slate-700">Prix</th>
                                            <th className="pb-3 font-semibold text-slate-700">Disponibilité</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {medicaments.map((med) => (
                                            <tr key={med.id_medicament} className="border-b border-slate-100">
                                                <td className="py-3 pr-4 font-medium text-slate-900">{med.nom_medicament}</td>
                                                <td className="py-3 pr-4 font-semibold text-teal-600">
                                                    {Number(med.prix || 0).toLocaleString("fr-FR")} FCFA
                                                </td>
                                                <td className="py-3">
                                                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                                                        Disponible
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}

export default Caissiere;