import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { medicamentService } from "../services/medicamentService";
import { commandeService } from "../services/commandeService";
import { stockService } from "../services/stockService";
import { notificationService } from "../services/notificationService";
import { livreurService } from "../services/livreurService";
import { caissiereService } from "../services/caissiereService";
import { authService } from "../services/authService";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

function AdminPharmacie() {
    const [activeTab, setActiveTab] = useState("dashboard");
    const [medicaments, setMedicaments] = useState([]);
    const [commandes, setCommandes] = useState([]);
    const [stocks, setStocks] = useState([]);
    const [alertesStock, setAlertesStock] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [livreurs, setLivreurs] = useState([]);
    const [caissieres, setCaissieres] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showAddMedicament, setShowAddMedicament] = useState(false);
    const [showAddLivreur, setShowAddLivreur] = useState(false);
    const [showAddCaissiere, setShowAddCaissiere] = useState(false);
    const [newMedicament, setNewMedicament] = useState({
        nom_medicament: "",
        description: "",
        prix: "",
        date_expiration: "",
        numero_lot: "",
    });
    const [newLivreur, setNewLivreur] = useState({
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
        mot_de_passe: "",
    });
    const [newCaissiere, setNewCaissiere] = useState({
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
        mot_de_passe: "",
    });
    const { isAuthenticated, isAdminPharmacie, user } = useAuth();
    const navigate = useNavigate();

    const idPharmacie = user?.id_pharmacie;

    useEffect(() => {
        if (!isAuthenticated || !isAdminPharmacie) {
            navigate("/login");
            return;
        }
        loadData();
    }, [isAuthenticated, isAdminPharmacie]);

    const loadData = async () => {
        setLoading(true);
        setError("");
        try {
            const [notifs] = await Promise.all([
                notificationService.getAll(),
            ]);
            setNotifications(notifs);

            if (idPharmacie) {
                const [meds, commandesData, livreursData, caissieresData] = await Promise.all([
                    medicamentService.getByPharmacie(idPharmacie),
                    commandeService.getByPharmacie(idPharmacie),
                    livreurService.getByPharmacie(idPharmacie),
                    caissiereService.getByPharmacie(idPharmacie),
                ]);
                setMedicaments(meds);
                setCommandes(commandesData);
                setLivreurs(livreursData);
                setCaissieres(caissieresData);
            }

            try {
                const [stockData, alertesData] = await Promise.all([
                    stockService.getStock(),
                    stockService.getAlertes(),
                ]);
                setStocks(stockData);
                setAlertesStock(alertesData);
            } catch (err) {
                console.error("Erreur stock:", err);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors du chargement");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateMedicament = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await medicamentService.create({
                ...newMedicament,
                id_pharmacie: idPharmacie,
                prix: Number(newMedicament.prix),
            });
            setShowAddMedicament(false);
            setNewMedicament({
                nom_medicament: "",
                description: "",
                prix: "",
                date_expiration: "",
                numero_lot: "",
            });
            const meds = await medicamentService.getByPharmacie(idPharmacie);
            setMedicaments(meds);
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la création");
        }
    };

    const handleDeleteMedicament = async (id) => {
        if (!window.confirm("Supprimer ce médicament ?")) return;
        try {
            await medicamentService.delete(id);
            const meds = await medicamentService.getByPharmacie(idPharmacie);
            setMedicaments(meds);
        } catch (err) {
            alert(err.response?.data?.message || "Erreur lors de la suppression");
        }
    };

    const handleChangerStatut = async (id, statut) => {
        try {
            await commandeService.changerStatut(id, statut);
            const commandesData = await commandeService.getByPharmacie(idPharmacie);
            setCommandes(commandesData);
        } catch (err) {
            alert(err.response?.data?.message || "Erreur lors du changement de statut");
        }
    };

    const handleCreateLivreur = async (e) => {
        e.preventDefault();
        setError("");
        try {
            // Créer le compte utilisateur livreur
            const compte = await authService.registerLivreur({
                ...newLivreur,
                id_pharmacie: idPharmacie,
            });
            // Créer l'entrée livreur
            await livreurService.create({
                nom: newLivreur.nom,
                prenom: newLivreur.prenom,
                email: newLivreur.email,
                telephone: newLivreur.telephone,
                id_pharmacie: idPharmacie,
                id_utilisateur: compte.id,
            });
            setShowAddLivreur(false);
            setNewLivreur({ nom: "", prenom: "", email: "", telephone: "", mot_de_passe: "" });
            const livreursData = await livreurService.getByPharmacie(idPharmacie);
            setLivreurs(livreursData);
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la création du livreur");
        }
    };

    const handleCreateCaissiere = async (e) => {
        e.preventDefault();
        setError("");
        try {
            // Créer le compte utilisateur caissière
            const compte = await authService.registerCaissiere({
                ...newCaissiere,
                id_pharmacie: idPharmacie,
            });
            // Créer l'entrée caissière
            await caissiereService.create({
                nom: newCaissiere.nom,
                prenom: newCaissiere.prenom,
                email: newCaissiere.email,
                telephone: newCaissiere.telephone,
                id_pharmacie: idPharmacie,
                id_utilisateur: compte.id,
            });
            setShowAddCaissiere(false);
            setNewCaissiere({ nom: "", prenom: "", email: "", telephone: "", mot_de_passe: "" });
            const caissieresData = await caissiereService.getByPharmacie(idPharmacie);
            setCaissieres(caissieresData);
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la création de la caissière");
        }
    };

    const handleDeleteLivreur = async (id) => {
        if (!window.confirm("Supprimer ce livreur ?")) return;
        try {
            await livreurService.delete(id);
            const livreursData = await livreurService.getByPharmacie(idPharmacie);
            setLivreurs(livreursData);
        } catch (err) {
            alert(err.response?.data?.message || "Erreur lors de la suppression");
        }
    };

    const handleDeleteCaissiere = async (id) => {
        if (!window.confirm("Supprimer cette caissière ?")) return;
        try {
            await caissiereService.delete(id);
            const caissieresData = await caissiereService.getByPharmacie(idPharmacie);
            setCaissieres(caissieresData);
        } catch (err) {
            alert(err.response?.data?.message || "Erreur lors de la suppression");
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

    const tabs = [
        { id: "dashboard", label: "Tableau de bord", icon: "📊" },
        { id: "medicaments", label: "Médicaments", icon: "💊" },
        { id: "commandes", label: "Commandes", icon: "📦" },
        { id: "stocks", label: "Stocks", icon: "📦" },
        { id: "equipe", label: "Équipe", icon: "👥" },
        { id: "notifications", label: "Notifications", icon: "🔔" },
    ];

    const commandesEnAttente = commandes.filter((c) => c.statut === "en_attente").length;
    const stockFaible = alertesStock.length;

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
                        Administration Pharmacie
                    </h1>
                    <p className="mt-3 text-lg text-slate-600">
                        Gérez vos médicaments, commandes et stocks
                    </p>
                </div>

                {error && (
                    <div className="mb-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {/* Onglets */}
                <div className="mb-8 flex flex-wrap gap-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                                activeTab === tab.id
                                    ? "bg-blue-600 text-white"
                                    : "bg-white text-slate-600 hover:bg-slate-100"
                            }`}
                        >
                            <span className="mr-2">{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Dashboard */}
                {activeTab === "dashboard" && (
                    <div className="space-y-6">
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                                <p className="text-sm text-slate-500">Médicaments</p>
                                <p className="mt-2 text-3xl font-bold text-slate-900">{medicaments.length}</p>
                            </div>
                            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                                <p className="text-sm text-slate-500">Commandes en attente</p>
                                <p className="mt-2 text-3xl font-bold text-amber-600">{commandesEnAttente}</p>
                            </div>
                            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                                <p className="text-sm text-slate-500">Alertes stock</p>
                                <p className={`mt-2 text-3xl font-bold ${stockFaible > 0 ? "text-red-600" : "text-green-600"}`}>
                                    {stockFaible}
                                </p>
                            </div>
                            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                                <p className="text-sm text-slate-500">Notifications</p>
                                <p className="mt-2 text-3xl font-bold text-slate-900">{notifications.length}</p>
                            </div>
                        </div>

                        {/* Alertes stock */}
                        {alertesStock.length > 0 && (
                            <div className="rounded-2xl border border-red-100 bg-red-50 p-6">
                                <h2 className="text-lg font-bold text-red-800">⚠️ Alertes de stock faible</h2>
                                <div className="mt-4 space-y-2">
                                    {alertesStock.map((alerte) => (
                                        <div key={alerte.id_stock} className="flex justify-between rounded-xl bg-white p-3">
                                            <span className="font-medium text-slate-800">
                                                {alerte.nom_medicament || `Stock #${alerte.id_stock}`}
                                            </span>
                                            <span className="font-bold text-red-600">
                                                {alerte.quantite} restant(s)
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Médicaments */}
                {activeTab === "medicaments" && (
                    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold text-slate-900">Gestion des médicaments</h2>
                            <button
                                onClick={() => setShowAddMedicament(!showAddMedicament)}
                                className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                            >
                                {showAddMedicament ? "Annuler" : "+ Ajouter un médicament"}
                            </button>
                        </div>

                        {showAddMedicament && (
                            <form onSubmit={handleCreateMedicament} className="mt-6 space-y-4 rounded-xl bg-slate-50 p-4">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-slate-700">Nom</label>
                                        <input
                                            type="text"
                                            value={newMedicament.nom_medicament}
                                            onChange={(e) => setNewMedicament({ ...newMedicament, nom_medicament: e.target.value })}
                                            required
                                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-slate-700">Prix (FCFA)</label>
                                        <input
                                            type="number"
                                            value={newMedicament.prix}
                                            onChange={(e) => setNewMedicament({ ...newMedicament, prix: e.target.value })}
                                            required
                                            min="0"
                                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-slate-700">Date d'expiration</label>
                                        <input
                                            type="date"
                                            value={newMedicament.date_expiration}
                                            onChange={(e) => setNewMedicament({ ...newMedicament, date_expiration: e.target.value })}
                                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-slate-700">Numéro de lot</label>
                                        <input
                                            type="text"
                                            value={newMedicament.numero_lot}
                                            onChange={(e) => setNewMedicament({ ...newMedicament, numero_lot: e.target.value })}
                                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                                        />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="mb-1.5 block text-sm font-medium text-slate-700">Description</label>
                                        <textarea
                                            value={newMedicament.description}
                                            onChange={(e) => setNewMedicament({ ...newMedicament, description: e.target.value })}
                                            rows={3}
                                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                                        />
                                    </div>
                                </div>
                                <button type="submit" className="rounded-xl bg-blue-600 px-6 py-2.5 font-semibold text-white transition hover:bg-blue-700">
                                    Créer le médicament
                                </button>
                            </form>
                        )}

                        <div className="mt-6 overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-slate-200">
                                        <th className="pb-3 pr-4 font-semibold text-slate-700">Nom</th>
                                        <th className="pb-3 pr-4 font-semibold text-slate-700">Prix</th>
                                        <th className="pb-3 pr-4 font-semibold text-slate-700">Description</th>
                                        <th className="pb-3 font-semibold text-slate-700">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {medicaments.map((med) => (
                                        <tr key={med.id_medicament} className="border-b border-slate-100">
                                            <td className="py-3 pr-4 font-medium text-slate-900">{med.nom_medicament}</td>
                                            <td className="py-3 pr-4 font-semibold text-blue-600">
                                                {Number(med.prix).toLocaleString("fr-FR")} FCFA
                                            </td>
                                            <td className="py-3 pr-4 text-slate-600 line-clamp-1">{med.description || "-"}</td>
                                            <td className="py-3">
                                                <button
                                                    onClick={() => handleDeleteMedicament(med.id_medicament)}
                                                    className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                                                >
                                                    Supprimer
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Commandes */}
                {activeTab === "commandes" && (
                    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-slate-900">Gestion des commandes</h2>
                        {commandes.length === 0 ? (
                            <p className="mt-4 text-sm text-slate-500">Aucune commande</p>
                        ) : (
                            <div className="mt-4 overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="border-b border-slate-200">
                                            <th className="pb-3 pr-4 font-semibold text-slate-700">N°</th>
                                            <th className="pb-3 pr-4 font-semibold text-slate-700">Client</th>
                                            <th className="pb-3 pr-4 font-semibold text-slate-700">Montant</th>
                                            <th className="pb-3 pr-4 font-semibold text-slate-700">Statut</th>
                                            <th className="pb-3 font-semibold text-slate-700">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {commandes.map((commande) => (
                                            <tr key={commande.id_commande} className="border-b border-slate-100">
                                                <td className="py-3 pr-4 font-medium text-slate-900">{commande.numero_commande}</td>
                                                <td className="py-3 pr-4 text-slate-600">
                                                    {commande.nom} {commande.prenom}
                                                </td>
                                                <td className="py-3 pr-4 font-semibold text-blue-600">
                                                    {Number(commande.montant_total).toLocaleString("fr-FR")} FCFA
                                                </td>
                                                <td className="py-3 pr-4">
                                                    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
                                                        {commande.statut}
                                                    </span>
                                                </td>
                                                <td className="py-3">
                                                    <select
                                                        value={commande.statut}
                                                        onChange={(e) => handleChangerStatut(commande.id_commande, e.target.value)}
                                                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs outline-none focus:border-blue-500"
                                                    >
                                                        <option value="en_attente">En attente</option>
                                                        <option value="confirmee">Confirmée</option>
                                                        <option value="en_preparation">En préparation</option>
                                                        <option value="en_livraison">En livraison</option>
                                                        <option value="livree">Livrée</option>
                                                        <option value="annulee">Annulée</option>
                                                    </select>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* Stocks */}
                {activeTab === "stocks" && (
                    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-slate-900">Gestion des stocks</h2>
                        {stocks.length === 0 ? (
                            <p className="mt-4 text-sm text-slate-500">Aucun stock disponible</p>
                        ) : (
                            <div className="mt-4 overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="border-b border-slate-200">
                                            <th className="pb-3 pr-4 font-semibold text-slate-700">Médicament</th>
                                            <th className="pb-3 pr-4 font-semibold text-slate-700">Quantité</th>
                                            <th className="pb-3 pr-4 font-semibold text-slate-700">Statut</th>
                                            <th className="pb-3 font-semibold text-slate-700">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stocks.map((stock) => (
                                            <tr key={stock.id_stock} className="border-b border-slate-100">
                                                <td className="py-3 pr-4 font-medium text-slate-900">
                                                    {stock.nom_medicament || `Stock #${stock.id_stock}`}
                                                </td>
                                                <td className="py-3 pr-4 text-slate-600 font-semibold">{stock.quantite}</td>
                                                <td className="py-3 pr-4">
                                                    {stock.quantite <= 10 ? (
                                                        <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                                                            Stock faible
                                                        </span>
                                                    ) : (
                                                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                                                            Disponible
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-3">
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            defaultValue={stock.quantite}
                                                            id={`input-stock-${stock.id_stock}`}
                                                            className="w-20 rounded-lg border border-slate-200 px-2.5 py-1 text-sm outline-none focus:border-blue-500"
                                                        />
                                                        <button
                                                            onClick={async () => {
                                                                const val = parseInt(document.getElementById(`input-stock-${stock.id_stock}`).value);
                                                                if (isNaN(val) || val < 0) return alert("Quantité invalide");
                                                                try {
                                                                    await stockService.modifierQuantite(stock.id_stock, val);
                                                                    const [stockData, alertesData] = await Promise.all([
                                                                        stockService.getStock(),
                                                                        stockService.getAlertes(),
                                                                    ]);
                                                                    setStocks(stockData);
                                                                    setAlertes(alertesData);
                                                                    alert("Stock mis à jour avec succès !");
                                                                } catch (err) {
                                                                    alert(err.response?.data?.message || "Erreur lors de la modification du stock");
                                                                }
                                                            }}
                                                            className="rounded-lg bg-blue-600 px-3 py-1 text-xs font-semibold text-white transition hover:bg-blue-700"
                                                        >
                                                            Mettre à jour
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* Équipe (livreurs & caissières) */}
                {activeTab === "equipe" && (
                    <div className="space-y-6">
                        {/* Livreurs */}
                        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-bold text-slate-900">🛵 Livreurs</h2>
                                <button
                                    onClick={() => setShowAddLivreur(!showAddLivreur)}
                                    className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                                >
                                    {showAddLivreur ? "Annuler" : "+ Ajouter un livreur"}
                                </button>
                            </div>

                            {showAddLivreur && (
                                <form onSubmit={handleCreateLivreur} className="mt-6 space-y-4 rounded-xl bg-slate-50 p-4">
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div>
                                            <label className="mb-1.5 block text-sm font-medium text-slate-700">Nom</label>
                                            <input
                                                type="text"
                                                value={newLivreur.nom}
                                                onChange={(e) => setNewLivreur({ ...newLivreur, nom: e.target.value })}
                                                required
                                                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1.5 block text-sm font-medium text-slate-700">Prénom</label>
                                            <input
                                                type="text"
                                                value={newLivreur.prenom}
                                                onChange={(e) => setNewLivreur({ ...newLivreur, prenom: e.target.value })}
                                                required
                                                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
                                            <input
                                                type="email"
                                                value={newLivreur.email}
                                                onChange={(e) => setNewLivreur({ ...newLivreur, email: e.target.value })}
                                                required
                                                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1.5 block text-sm font-medium text-slate-700">Téléphone</label>
                                            <input
                                                type="tel"
                                                value={newLivreur.telephone}
                                                onChange={(e) => setNewLivreur({ ...newLivreur, telephone: e.target.value })}
                                                required
                                                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                                            />
                                        </div>
                                        <div className="sm:col-span-2">
                                            <label className="mb-1.5 block text-sm font-medium text-slate-700">Mot de passe</label>
                                            <input
                                                type="password"
                                                value={newLivreur.mot_de_passe}
                                                onChange={(e) => setNewLivreur({ ...newLivreur, mot_de_passe: e.target.value })}
                                                required
                                                minLength={6}
                                                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                                            />
                                        </div>
                                    </div>
                                    <button type="submit" className="rounded-xl bg-blue-600 px-6 py-2.5 font-semibold text-white transition hover:bg-blue-700">
                                        Créer le livreur
                                    </button>
                                </form>
                            )}

                            {livreurs.length === 0 ? (
                                <p className="mt-4 text-sm text-slate-500">Aucun livreur pour cette pharmacie</p>
                            ) : (
                                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    {livreurs.map((livreur) => (
                                        <div key={livreur.id_livreur} className="rounded-xl border border-slate-100 p-4">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="font-semibold text-slate-900">
                                                        {livreur.prenom} {livreur.nom}
                                                    </h3>
                                                    <p className="mt-1 text-sm text-slate-500">📞 {livreur.telephone || "Non renseigné"}</p>
                                                    {livreur.email && (
                                                        <p className="mt-1 text-sm text-slate-500">✉️ {livreur.email}</p>
                                                    )}
                                                    <span className="mt-2 inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                                                        {livreur.statut || "disponible"}
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={() => handleDeleteLivreur(livreur.id_livreur)}
                                                    className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                                                >
                                                    Supprimer
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Caissières */}
                        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-bold text-slate-900">💰 Caissières</h2>
                                <button
                                    onClick={() => setShowAddCaissiere(!showAddCaissiere)}
                                    className="rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-700"
                                >
                                    {showAddCaissiere ? "Annuler" : "+ Ajouter une caissière"}
                                </button>
                            </div>

                            {showAddCaissiere && (
                                <form onSubmit={handleCreateCaissiere} className="mt-6 space-y-4 rounded-xl bg-slate-50 p-4">
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div>
                                            <label className="mb-1.5 block text-sm font-medium text-slate-700">Nom</label>
                                            <input
                                                type="text"
                                                value={newCaissiere.nom}
                                                onChange={(e) => setNewCaissiere({ ...newCaissiere, nom: e.target.value })}
                                                required
                                                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-teal-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1.5 block text-sm font-medium text-slate-700">Prénom</label>
                                            <input
                                                type="text"
                                                value={newCaissiere.prenom}
                                                onChange={(e) => setNewCaissiere({ ...newCaissiere, prenom: e.target.value })}
                                                required
                                                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-teal-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
                                            <input
                                                type="email"
                                                value={newCaissiere.email}
                                                onChange={(e) => setNewCaissiere({ ...newCaissiere, email: e.target.value })}
                                                required
                                                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-teal-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1.5 block text-sm font-medium text-slate-700">Téléphone</label>
                                            <input
                                                type="tel"
                                                value={newCaissiere.telephone}
                                                onChange={(e) => setNewCaissiere({ ...newCaissiere, telephone: e.target.value })}
                                                required
                                                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-teal-500"
                                            />
                                        </div>
                                        <div className="sm:col-span-2">
                                            <label className="mb-1.5 block text-sm font-medium text-slate-700">Mot de passe</label>
                                            <input
                                                type="password"
                                                value={newCaissiere.mot_de_passe}
                                                onChange={(e) => setNewCaissiere({ ...newCaissiere, mot_de_passe: e.target.value })}
                                                required
                                                minLength={6}
                                                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-teal-500"
                                            />
                                        </div>
                                    </div>
                                    <button type="submit" className="rounded-xl bg-teal-600 px-6 py-2.5 font-semibold text-white transition hover:bg-teal-700">
                                        Créer la caissière
                                    </button>
                                </form>
                            )}

                            {caissieres.length === 0 ? (
                                <p className="mt-4 text-sm text-slate-500">Aucune caissière pour cette pharmacie</p>
                            ) : (
                                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    {caissieres.map((caissiere) => (
                                        <div key={caissiere.id_caissiere} className="rounded-xl border border-slate-100 p-4">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="font-semibold text-slate-900">
                                                        {caissiere.prenom} {caissiere.nom}
                                                    </h3>
                                                    <p className="mt-1 text-sm text-slate-500">📞 {caissiere.telephone || "Non renseigné"}</p>
                                                    {caissiere.email && (
                                                        <p className="mt-1 text-sm text-slate-500">✉️ {caissiere.email}</p>
                                                    )}
                                                    <span className="mt-2 inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                                                        {caissiere.statut || "active"}
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={() => handleDeleteCaissiere(caissiere.id_caissiere)}
                                                    className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                                                >
                                                    Supprimer
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Notifications */}
                {activeTab === "notifications" && (
                    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-slate-900">Notifications</h2>
                        {notifications.length === 0 ? (
                            <p className="mt-4 text-sm text-slate-500">Aucune notification</p>
                        ) : (
                            <div className="mt-4 space-y-3">
                                {notifications.map((notif) => (
                                    <div key={notif.id_notification} className="rounded-xl border border-slate-100 p-4">
                                        <p className="font-medium text-slate-900">{notif.message}</p>
                                        <p className="mt-1 text-xs text-slate-500">
                                            {new Date(notif.date_creation).toLocaleString("fr-FR")}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}

export default AdminPharmacie;