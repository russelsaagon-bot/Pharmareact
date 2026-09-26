import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { clientService } from "../services/clientService";
import { commandeService } from "../services/commandeService";
import { paiementService } from "../services/paiementService";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

function Commande() {
    const [panier, setPanier] = useState({ articles: [], total: 0 });
    const [adresses, setAdresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(null);
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        id_pharmacie: "",
        mode_reception: "livraison",
        id_adresse: "",
        methode_paiement: "mobile_money",
        telephone_mobile: "",
    });

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login");
            return;
        }
        loadData();
    }, [isAuthenticated]);

    const loadData = async () => {
        try {
            const [panierData, adressesData] = await Promise.all([
                clientService.getPanier(),
                clientService.getAdresses(),
            ]);
            setPanier(panierData);
            setAdresses(adressesData);

            // Déterminer la pharmacie par défaut
            if (panierData.articles?.length > 0) {
                const firstArticle = panierData.articles[0];
                // On ne peut pas déterminer la pharmacie depuis le panier directement,
                // on laisse l'utilisateur choisir
            }
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors du chargement");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSubmitting(true);

        try {
            // Créer la commande
            const medicaments = panier.articles.map((a) => ({
                id_medicament: a.id_medicament,
                quantite: a.quantite,
            }));

            const commandeData = {
                mode_reception: formData.mode_reception,
                medicaments,
            };

            const commandeResult = await commandeService.create(commandeData);
            const id_commande = commandeResult.commande?.id_commande || commandeResult.commande;

            // Créer le paiement
            if (formData.methode_paiement === "mobile_money") {
                await paiementService.payerMobileMoney({
                    id_commande,
                    montant: panier.total,
                    telephone: formData.telephone_mobile,
                    operateur: formData.telephone_mobile?.startsWith("6") ? "mtn" : "orange",
                });
            } else {
                await paiementService.create({
                    id_commande,
                    montant: panier.total,
                    methode: formData.methode_paiement,
                });
            }

            // Vider le panier
            await clientService.clearPanier();

            setSuccess({
                id_commande,
                numero: commandeResult.commande?.numero_commande || `CMD-${id_commande}`,
                montant: panier.total,
            });
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la commande");
        } finally {
            setSubmitting(false);
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

    if (success) {
        return (
            <div className="min-h-screen bg-white">
                <Navbar />
                <main className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
                    <div className="rounded-2xl border border-green-100 bg-green-50 p-8">
                        <p className="text-5xl">✅</p>
                        <h1 className="mt-4 text-2xl font-bold text-slate-900">
                            Commande confirmée !
                        </h1>
                        <p className="mt-2 text-slate-600">
                            Votre commande <span className="font-semibold">{success.numero}</span> a été créée avec succès.
                        </p>
                        <p className="mt-2 text-slate-600">
                            Montant total : <span className="font-bold text-blue-600">{Number(success.montant).toLocaleString("fr-FR")} FCFA</span>
                        </p>
                        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                            <Link
                                to={`/suivi/${success.id_commande}`}
                                className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
                            >
                                Suivre ma commande
                            </Link>
                            <Link
                                to="/"
                                className="rounded-xl border border-slate-200 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
                            >
                                Retour à l'accueil
                            </Link>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
                <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
                    Passer la commande
                </h1>
                <p className="mt-3 text-lg text-slate-600">
                    Finalisez votre commande en quelques étapes
                </p>

                {error && (
                    <div className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {panier.articles?.length === 0 ? (
                    <div className="mt-8 rounded-2xl border border-slate-100 bg-slate-50 p-12 text-center">
                        <p className="text-4xl">🛒</p>
                        <p className="mt-4 text-lg font-semibold text-slate-700">
                            Votre panier est vide
                        </p>
                        <Link
                            to="/medicaments"
                            className="mt-4 inline-block text-blue-600 hover:underline"
                        >
                            Voir les médicaments
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="mt-8 grid gap-8 lg:grid-cols-3">
                        <div className="space-y-6 lg:col-span-2">
                            {/* Mode de réception */}
                            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                                <h2 className="text-lg font-bold text-slate-900">Mode de réception</h2>
                                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                    <label className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${formData.mode_reception === "livraison" ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:bg-slate-50"}`}>
                                        <input
                                            type="radio"
                                            name="mode_reception"
                                            value="livraison"
                                            checked={formData.mode_reception === "livraison"}
                                            onChange={handleChange}
                                            className="sr-only"
                                        />
                                        <span className="text-2xl">🚚</span>
                                        <div>
                                            <p className="font-semibold text-slate-900">Livraison</p>
                                            <p className="text-sm text-slate-500">À votre adresse</p>
                                        </div>
                                    </label>
                                    <label className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${formData.mode_reception === "retrait" ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:bg-slate-50"}`}>
                                        <input
                                            type="radio"
                                            name="mode_reception"
                                            value="retrait"
                                            checked={formData.mode_reception === "retrait"}
                                            onChange={handleChange}
                                            className="sr-only"
                                        />
                                        <span className="text-2xl">🏪</span>
                                        <div>
                                            <p className="font-semibold text-slate-900">Retrait en pharmacie</p>
                                            <p className="text-sm text-slate-500">En pharmacie</p>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            {/* Adresse de livraison */}
                            {formData.mode_reception === "livraison" && (
                                <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                                    <h2 className="text-lg font-bold text-slate-900">Adresse de livraison</h2>
                                    {adresses.length === 0 ? (
                                        <p className="mt-4 text-sm text-slate-500">
                                            Aucune adresse enregistrée.{" "}
                                            <Link to="/profil" className="text-blue-600 hover:underline">
                                                Ajoutez une adresse
                                            </Link>
                                        </p>
                                    ) : (
                                        <div className="mt-4 space-y-3">
                                            {adresses.map((adresse) => (
                                                <label key={adresse.id_adresse} className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${formData.id_adresse === String(adresse.id_adresse) ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:bg-slate-50"}`}>
                                                    <input
                                                        type="radio"
                                                        name="id_adresse"
                                                        value={adresse.id_adresse}
                                                        checked={formData.id_adresse === String(adresse.id_adresse)}
                                                        onChange={handleChange}
                                                        className="mt-1"
                                                    />
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
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Paiement */}
                            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                                <h2 className="text-lg font-bold text-slate-900">Paiement</h2>
                                <div className="mt-4 space-y-3">
                                    <label className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${formData.methode_paiement === "mobile_money" ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:bg-slate-50"}`}>
                                        <input
                                            type="radio"
                                            name="methode_paiement"
                                            value="mobile_money"
                                            checked={formData.methode_paiement === "mobile_money"}
                                            onChange={handleChange}
                                            className="sr-only"
                                        />
                                        <span className="text-2xl">📱</span>
                                        <div>
                                            <p className="font-semibold text-slate-900">Mobile Money</p>
                                            <p className="text-sm text-slate-500">MTN MoMo / Orange Money</p>
                                        </div>
                                    </label>
                                    <label className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${formData.methode_paiement === "especes" ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:bg-slate-50"}`}>
                                        <input
                                            type="radio"
                                            name="methode_paiement"
                                            value="especes"
                                            checked={formData.methode_paiement === "especes"}
                                            onChange={handleChange}
                                            className="sr-only"
                                        />
                                        <span className="text-2xl">💵</span>
                                        <div>
                                            <p className="font-semibold text-slate-900">Espèces</p>
                                            <p className="text-sm text-slate-500">Paiement à la livraison</p>
                                        </div>
                                    </label>

                                    {formData.methode_paiement === "mobile_money" && (
                                        <div>
                                            <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                                Numéro de téléphone
                                            </label>
                                            <input
                                                type="tel"
                                                name="telephone_mobile"
                                                value={formData.telephone_mobile}
                                                onChange={handleChange}
                                                required
                                                placeholder="+237 6XX XX XX XX"
                                                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Résumé */}
                        <div className="h-fit rounded-2xl border border-slate-100 bg-slate-50 p-6">
                            <h2 className="text-lg font-bold text-slate-900">Résumé de la commande</h2>
                            <div className="mt-4 space-y-3">
                                {panier.articles?.map((article) => (
                                    <div key={article.id_medicament} className="flex justify-between text-sm">
                                        <span className="text-slate-600">
                                            {article.nom_medicament} × {article.quantite}
                                        </span>
                                        <span className="font-semibold text-slate-900">
                                            {(article.prix * article.quantite).toLocaleString("fr-FR")} FCFA
                                        </span>
                                    </div>
                                ))}
                                <div className="border-t border-slate-200 pt-3">
                                    <div className="flex justify-between font-bold text-slate-900">
                                        <span>Total</span>
                                        <span>{Number(panier.total).toLocaleString("fr-FR")} FCFA</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="mt-6 w-full rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:opacity-50"
                            >
                                {submitting ? "Traitement..." : "Confirmer la commande"}
                            </button>
                        </div>
                    </form>
                )}
            </main>
            <Footer />
        </div>
    );
}

export default Commande;