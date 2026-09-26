import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { clientService } from "../services/clientService";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

function Profil() {
    const [profil, setProfil] = useState(null);
    const [adresses, setAdresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({ nom: "", prenom: "", telephone: "" });
    const [showAddAdresse, setShowAddAdresse] = useState(false);
    const [newAdresse, setNewAdresse] = useState({ libelle: "", adresse: "", ville: "", telephone: "" });
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login");
            return;
        }
        loadData();
    }, [isAuthenticated]);

    const loadData = async () => {
        try {
            const [profilData, adressesData] = await Promise.all([
                clientService.getProfil(),
                clientService.getAdresses(),
            ]);
            setProfil(profilData);
            setAdresses(adressesData);
            setFormData({
                nom: profilData.nom || "",
                prenom: profilData.prenom || "",
                telephone: profilData.telephone || "",
            });
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors du chargement du profil");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfil = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        try {
            await clientService.updateProfil(formData);
            setSuccess("Profil mis à jour avec succès");
            setEditing(false);
            await loadData();
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la mise à jour");
        }
    };

    const handleAddAdresse = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        try {
            await clientService.addAdresse(newAdresse);
            setSuccess("Adresse ajoutée avec succès");
            setShowAddAdresse(false);
            setNewAdresse({ libelle: "", adresse: "", ville: "", telephone: "" });
            const adressesData = await clientService.getAdresses();
            setAdresses(adressesData);
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de l'ajout de l'adresse");
        }
    };

    const handleDeleteAdresse = async (id) => {
        if (!window.confirm("Supprimer cette adresse ?")) return;
        try {
            await clientService.deleteAdresse(id);
            const adressesData = await clientService.getAdresses();
            setAdresses(adressesData);
        } catch (err) {
            alert(err.response?.data?.message || "Erreur lors de la suppression");
        }
    };

    const handleSetPrincipale = async (id) => {
        try {
            await clientService.setAdressePrincipale(id);
            const adressesData = await clientService.getAdresses();
            setAdresses(adressesData);
        } catch (err) {
            alert(err.response?.data?.message || "Erreur");
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
            <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
                <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
                    Mon profil
                </h1>
                <p className="mt-3 text-lg text-slate-600">
                    Gérez vos informations personnelles et vos adresses
                </p>

                {error && (
                    <div className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="mt-6 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
                        {success}
                    </div>
                )}

                {/* Informations personnelles */}
                <div className="mt-8 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-slate-900">Informations personnelles</h2>
                        <button
                            onClick={() => setEditing(!editing)}
                            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                            {editing ? "Annuler" : "Modifier"}
                        </button>
                    </div>

                    {editing ? (
                        <form onSubmit={handleUpdateProfil} className="mt-6 space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Nom</label>
                                    <input
                                        type="text"
                                        value={formData.nom}
                                        onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                                        required
                                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Prénom</label>
                                    <input
                                        type="text"
                                        value={formData.prenom}
                                        onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                                        required
                                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-slate-700">Téléphone</label>
                                <input
                                    type="tel"
                                    value={formData.telephone}
                                    onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                                    required
                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>
                            <button
                                type="submit"
                                className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
                            >
                                Enregistrer
                            </button>
                        </form>
                    ) : (
                        <div className="mt-6 grid gap-4 sm:grid-cols-3">
                            <div>
                                <p className="text-sm text-slate-500">Nom complet</p>
                                <p className="mt-1 font-semibold text-slate-900">
                                    {profil?.prenom} {profil?.nom}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Email</p>
                                <p className="mt-1 font-semibold text-slate-900">{profil?.email}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Téléphone</p>
                                <p className="mt-1 font-semibold text-slate-900">{profil?.telephone || "Non renseigné"}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Adresses */}
                <div className="mt-8 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-slate-900">Mes adresses</h2>
                        <button
                            onClick={() => setShowAddAdresse(!showAddAdresse)}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                        >
                            {showAddAdresse ? "Annuler" : "+ Ajouter"}
                        </button>
                    </div>

                    {showAddAdresse && (
                        <form onSubmit={handleAddAdresse} className="mt-6 space-y-4 rounded-xl bg-slate-50 p-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Libellé</label>
                                    <input
                                        type="text"
                                        value={newAdresse.libelle}
                                        onChange={(e) => setNewAdresse({ ...newAdresse, libelle: e.target.value })}
                                        placeholder="Maison, Bureau..."
                                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Ville</label>
                                    <input
                                        type="text"
                                        value={newAdresse.ville}
                                        onChange={(e) => setNewAdresse({ ...newAdresse, ville: e.target.value })}
                                        required
                                        placeholder="Douala"
                                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-slate-700">Adresse</label>
                                <input
                                    type="text"
                                    value={newAdresse.adresse}
                                    onChange={(e) => setNewAdresse({ ...newAdresse, adresse: e.target.value })}
                                    required
                                    placeholder="Quartier, rue, numéro..."
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-slate-700">Téléphone</label>
                                <input
                                    type="tel"
                                    value={newAdresse.telephone}
                                    onChange={(e) => setNewAdresse({ ...newAdresse, telephone: e.target.value })}
                                    placeholder="+237 6XX XX XX XX"
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>
                            <button
                                type="submit"
                                className="rounded-xl bg-blue-600 px-6 py-2.5 font-semibold text-white transition hover:bg-blue-700"
                            >
                                Ajouter l'adresse
                            </button>
                        </form>
                    )}

                    <div className="mt-6 space-y-3">
                        {adresses.length === 0 ? (
                            <p className="text-sm text-slate-500">Aucune adresse enregistrée</p>
                        ) : (
                            adresses.map((adresse) => (
                                <div key={adresse.id_adresse} className="flex items-center justify-between rounded-xl border border-slate-100 p-4">
                                    <div>
                                        <p className="font-semibold text-slate-900">
                                            {adresse.libelle || "Adresse"}
                                            {adresse.est_principale && (
                                                <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700">Principale</span>
                                            )}
                                        </p>
                                        <p className="mt-1 text-sm text-slate-500">
                                            {adresse.adresse}, {adresse.ville}
                                        </p>
                                        {adresse.telephone && (
                                            <p className="mt-1 text-sm text-slate-500">📞 {adresse.telephone}</p>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        {!adresse.est_principale && (
                                            <button
                                                onClick={() => handleSetPrincipale(adresse.id_adresse)}
                                                className="rounded-lg border border-blue-200 px-3 py-1.5 text-xs font-semibold text-blue-600 transition hover:bg-blue-50"
                                            >
                                                Définir principale
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDeleteAdresse(adresse.id_adresse)}
                                            className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                                        >
                                            Supprimer
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default Profil;