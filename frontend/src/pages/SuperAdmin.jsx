import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { pharmacieService } from "../services/pharmacieService";
import { utilisateurService } from "../services/utilisateurService";
import { statistiquesService } from "../services/statistiquesService";
import { commandeService } from "../services/commandeService";
import { notificationService } from "../services/notificationService";
import { authService } from "../services/authService";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

function SuperAdmin() {
    const [activeTab, setActiveTab] = useState("dashboard");
    const [pharmacies, setPharmacies] = useState([]);
    const [utilisateurs, setUtilisateurs] = useState([]);
    const [statistiques, setStatistiques] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showAddPharmacie, setShowAddPharmacie] = useState(false);
    const [showAddAdmin, setShowAddAdmin] = useState(false);
    const [newPharmacie, setNewPharmacie] = useState({
        nom_pharmacie: "",
        telephone: "",
        email: "",
        adresse: "",
        ville: "",
        pays: "Cameroun",
        horaires: "",
        quartier: "",
    });
    const [newAdmin, setNewAdmin] = useState({
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
        mot_de_passe: "",
        id_pharmacie: "",
    });
    const { isAuthenticated, isSuperAdmin } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated || !isSuperAdmin) {
            navigate("/login");
            return;
        }
        loadData();
    }, [isAuthenticated, isSuperAdmin]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [pharms, users, notifs] = await Promise.all([
                pharmacieService.getAll(),
                utilisateurService.getAll(),
                notificationService.getAll(),
            ]);
            setPharmacies(pharms);
            setUtilisateurs(users);
            setNotifications(notifs);

            try {
                const stats = await statistiquesService.getGlobales();
                setStatistiques(stats);
            } catch (err) {
                console.error("Erreur stats:", err);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors du chargement");
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePharmacie = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await pharmacieService.create(newPharmacie);
            setShowAddPharmacie(false);
            setNewPharmacie({
                nom_pharmacie: "",
                telephone: "",
                email: "",
                adresse: "",
                ville: "",
                pays: "Cameroun",
                horaires: "",
                quartier: "",
            });
            const pharms = await pharmacieService.getAll();
            setPharmacies(pharms);
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la création");
        }
    };

    const handleCreateAdmin = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await authService.registerAdminPharmacie({
                ...newAdmin,
                id_pharmacie: Number(newAdmin.id_pharmacie),
            });
            setShowAddAdmin(false);
            setNewAdmin({
                nom: "",
                prenom: "",
                email: "",
                telephone: "",
                mot_de_passe: "",
                id_pharmacie: "",
            });
            const users = await utilisateurService.getAll();
            setUtilisateurs(users);
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la création");
        }
    };

    const handleDeletePharmacie = async (id) => {
        if (!window.confirm("Supprimer cette pharmacie ?")) return;
        try {
            await pharmacieService.delete(id);
            const pharms = await pharmacieService.getAll();
            setPharmacies(pharms);
        } catch (err) {
            alert(err.response?.data?.message || "Erreur lors de la suppression");
        }
    };

    const handleDeleteUtilisateur = async (id) => {
        if (!window.confirm("Supprimer cet utilisateur ?")) return;
        try {
            await utilisateurService.delete(id);
            const users = await utilisateurService.getAll();
            setUtilisateurs(users);
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
        { id: "pharmacies", label: "Pharmacies", icon: "🏥" },
        { id: "utilisateurs", label: "Utilisateurs", icon: "👥" },
        { id: "notifications", label: "Notifications", icon: "🔔" },
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
                        Administration Super Admin
                    </h1>
                    <p className="mt-3 text-lg text-slate-600">
                        Gestion globale de la plateforme PharmaReact
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
                        {/* Statistiques */}
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                                <p className="text-sm text-slate-500">Pharmacies</p>
                                <p className="mt-2 text-3xl font-bold text-slate-900">
                                    {pharmacies.length}
                                </p>
                            </div>
                            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                                <p className="text-sm text-slate-500">Utilisateurs</p>
                                <p className="mt-2 text-3xl font-bold text-slate-900">
                                    {utilisateurs.length}
                                </p>
                            </div>
                            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                                <p className="text-sm text-slate-500">Notifications</p>
                                <p className="mt-2 text-3xl font-bold text-slate-900">
                                    {notifications.length}
                                </p>
                            </div>
                            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                                <p className="text-sm text-slate-500">Statut</p>
                                <p className="mt-2 text-3xl font-bold text-green-600">
                                    Actif
                                </p>
                            </div>
                        </div>

                        {/* Statistiques globales */}
                        {statistiques && (
                            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                                <h2 className="text-lg font-bold text-slate-900">Statistiques globales</h2>
                                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                                    <div className="rounded-xl bg-blue-50 p-4">
                                        <p className="text-sm text-blue-700">Total commandes</p>
                                        <p className="mt-1 text-2xl font-bold text-blue-900">
                                            {statistiques.total_commandes || 0}
                                        </p>
                                    </div>
                                    <div className="rounded-xl bg-green-50 p-4">
                                        <p className="text-sm text-green-700">Chiffre d'affaires</p>
                                        <p className="mt-1 text-2xl font-bold text-green-900">
                                            {Number(statistiques.chiffre_affaires || 0).toLocaleString("fr-FR")} FCFA
                                        </p>
                                    </div>
                                    <div className="rounded-xl bg-purple-50 p-4">
                                        <p className="text-sm text-purple-700">Clients</p>
                                        <p className="mt-1 text-2xl font-bold text-purple-900">
                                            {statistiques.total_clients || 0}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Pharmacies */}
                {activeTab === "pharmacies" && (
                    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold text-slate-900">Gestion des pharmacies</h2>
                            <button
                                onClick={() => setShowAddPharmacie(!showAddPharmacie)}
                                className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                            >
                                {showAddPharmacie ? "Annuler" : "+ Ajouter une pharmacie"}
                            </button>
                        </div>

                        {showAddPharmacie && (
                            <form onSubmit={handleCreatePharmacie} className="mt-6 space-y-4 rounded-xl bg-slate-50 p-4">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-slate-700">Nom</label>
                                        <input
                                            type="text"
                                            value={newPharmacie.nom_pharmacie}
                                            onChange={(e) => setNewPharmacie({ ...newPharmacie, nom_pharmacie: e.target.value })}
                                            required
                                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-slate-700">Téléphone</label>
                                        <input
                                            type="tel"
                                            value={newPharmacie.telephone}
                                            onChange={(e) => setNewPharmacie({ ...newPharmacie, telephone: e.target.value })}
                                            required
                                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
                                        <input
                                            type="email"
                                            value={newPharmacie.email}
                                            onChange={(e) => setNewPharmacie({ ...newPharmacie, email: e.target.value })}
                                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-slate-700">Ville</label>
                                        <input
                                            type="text"
                                            value={newPharmacie.ville}
                                            onChange={(e) => setNewPharmacie({ ...newPharmacie, ville: e.target.value })}
                                            required
                                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-slate-700">Quartier</label>
                                        <input
                                            type="text"
                                            value={newPharmacie.quartier}
                                            onChange={(e) => setNewPharmacie({ ...newPharmacie, quartier: e.target.value })}
                                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-slate-700">Adresse</label>
                                        <input
                                            type="text"
                                            value={newPharmacie.adresse}
                                            onChange={(e) => setNewPharmacie({ ...newPharmacie, adresse: e.target.value })}
                                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-slate-700">Horaires</label>
                                        <input
                                            type="text"
                                            value={newPharmacie.horaires}
                                            onChange={(e) => setNewPharmacie({ ...newPharmacie, horaires: e.target.value })}
                                            placeholder="8h - 20h"
                                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-slate-700">Pays</label>
                                        <input
                                            type="text"
                                            value={newPharmacie.pays}
                                            onChange={(e) => setNewPharmacie({ ...newPharmacie, pays: e.target.value })}
                                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                                        />
                                    </div>
                                </div>
                                <button type="submit" className="rounded-xl bg-blue-600 px-6 py-2.5 font-semibold text-white transition hover:bg-blue-700">
                                    Créer la pharmacie
                                </button>
                            </form>
                        )}

                        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {pharmacies.map((pharmacie) => (
                                <div key={pharmacie.id_pharmacie} className="rounded-xl border border-slate-100 p-4">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="font-semibold text-slate-900">{pharmacie.nom_pharmacie}</h3>
                                            <p className="mt-1 text-sm text-slate-500">
                                                {pharmacie.ville} {pharmacie.quartier ? `· ${pharmacie.quartier}` : ""}
                                            </p>
                                            <p className="mt-1 text-sm text-slate-500">📞 {pharmacie.telephone || "Non renseigné"}</p>
                                            {pharmacie.email && (
                                                <p className="mt-1 text-sm text-slate-500">✉️ {pharmacie.email}</p>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => handleDeletePharmacie(pharmacie.id_pharmacie)}
                                            className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                                        >
                                            Supprimer
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Utilisateurs */}
                {activeTab === "utilisateurs" && (
                    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold text-slate-900">Gestion des utilisateurs</h2>
                            <button
                                onClick={() => setShowAddAdmin(!showAddAdmin)}
                                className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                            >
                                {showAddAdmin ? "Annuler" : "+ Ajouter un admin"}
                            </button>
                        </div>

                        {showAddAdmin && (
                            <form onSubmit={handleCreateAdmin} className="mt-6 space-y-4 rounded-xl bg-slate-50 p-4">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-slate-700">Nom</label>
                                        <input
                                            type="text"
                                            value={newAdmin.nom}
                                            onChange={(e) => setNewAdmin({ ...newAdmin, nom: e.target.value })}
                                            required
                                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-slate-700">Prénom</label>
                                        <input
                                            type="text"
                                            value={newAdmin.prenom}
                                            onChange={(e) => setNewAdmin({ ...newAdmin, prenom: e.target.value })}
                                            required
                                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
                                        <input
                                            type="email"
                                            value={newAdmin.email}
                                            onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                                            required
                                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-slate-700">Téléphone</label>
                                        <input
                                            type="tel"
                                            value={newAdmin.telephone}
                                            onChange={(e) => setNewAdmin({ ...newAdmin, telephone: e.target.value })}
                                            required
                                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-slate-700">Mot de passe</label>
                                        <input
                                            type="password"
                                            value={newAdmin.mot_de_passe}
                                            onChange={(e) => setNewAdmin({ ...newAdmin, mot_de_passe: e.target.value })}
                                            required
                                            minLength={6}
                                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-slate-700">Pharmacie</label>
                                        <select
                                            value={newAdmin.id_pharmacie}
                                            onChange={(e) => setNewAdmin({ ...newAdmin, id_pharmacie: e.target.value })}
                                            required
                                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                                        >
                                            <option value="">Sélectionner une pharmacie</option>
                                            {pharmacies.map((p) => (
                                                <option key={p.id_pharmacie} value={p.id_pharmacie}>
                                                    {p.nom_pharmacie}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <button type="submit" className="rounded-xl bg-blue-600 px-6 py-2.5 font-semibold text-white transition hover:bg-blue-700">
                                    Créer l'administrateur
                                </button>
                            </form>
                        )}

                        <div className="mt-6 overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-slate-200">
                                        <th className="pb-3 pr-4 font-semibold text-slate-700">Nom</th>
                                        <th className="pb-3 pr-4 font-semibold text-slate-700">Email</th>
                                        <th className="pb-3 pr-4 font-semibold text-slate-700">Téléphone</th>
                                        <th className="pb-3 font-semibold text-slate-700">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {utilisateurs.map((user) => (
                                        <tr key={user.id_utilisateur} className="border-b border-slate-100">
                                            <td className="py-3 pr-4 font-medium text-slate-900">
                                                {user.prenom} {user.nom}
                                            </td>
                                            <td className="py-3 pr-4 text-slate-600">{user.email}</td>
                                            <td className="py-3 pr-4 text-slate-600">{user.telephone || "Non renseigné"}</td>
                                            <td className="py-3">
                                                <button
                                                    onClick={() => handleDeleteUtilisateur(user.id_utilisateur)}
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

export default SuperAdmin;