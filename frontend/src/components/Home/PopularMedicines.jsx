import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { medicamentService } from "../../services/medicamentService";
import { pharmacieService } from "../../services/pharmacieService";
import { useAuth } from "../../context/AuthContext";
import { clientService } from "../../services/clientService";

function PopularMedicines() {
    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [addedToCart, setAddedToCart] = useState({});
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        loadMedicines();
    }, []);

    const loadMedicines = async () => {
        try {
            const pharmacies = await pharmacieService.getAll();
            if (pharmacies.length > 0) {
                const firstPharmacy = pharmacies[0];
                const meds = await medicamentService.getByPharmacie(firstPharmacy.id_pharmacie);
                setMedicines(meds.slice(0, 4));
            }
        } catch (err) {
            console.error("Erreur chargement médicaments:", err);
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

    return (
        <section className="bg-white py-16 md:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                            Médicaments populaires
                        </h2>
                        <p className="mt-4 text-lg text-slate-600">
                            Les médicaments les plus recherchés par nos clients.
                        </p>
                    </div>
                    <Link
                        to="/medicaments"
                        className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                        Voir tous les médicaments
                    </Link>
                </div>

                {loading ? (
                    <div className="mt-12 flex justify-center py-10">
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
                    </div>
                ) : (
                    <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {medicines.map((medicine) => (
                            <div
                                key={medicine.id_medicament}
                                className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                            >
                                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-3xl transition group-hover:bg-blue-100">
                                    {medicine.image ? (
                                        <img src={medicine.image} alt={medicine.nom_medicament} className="h-full w-full rounded-2xl object-cover" />
                                    ) : (
                                        "💊"
                                    )}
                                </div>
                                <h3 className="mt-4 font-semibold text-slate-900">
                                    {medicine.nom_medicament}
                                </h3>
                                {medicine.description && (
                                    <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                                        {medicine.description}
                                    </p>
                                )}
                                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                                    <span className="font-bold text-blue-600">
                                        {Number(medicine.prix).toLocaleString("fr-FR")} FCFA
                                    </span>
                                    <button
                                        onClick={() => handleAddToCart(medicine)}
                                        className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                                            addedToCart[medicine.id_medicament]
                                                ? "bg-green-600 text-white"
                                                : "bg-blue-600 text-white hover:bg-blue-700"
                                        }`}
                                    >
                                        {addedToCart[medicine.id_medicament] ? "✓ Ajouté" : "Ajouter"}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

export default PopularMedicines;