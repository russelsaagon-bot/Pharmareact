import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { categorieService } from "../../services/categorieService";

const categoryIcons = {
    "Médicaments": "💊",
    "Soins & Bien-être": "🤒",
    "Bébé & Maman": "👶",
    "Dermo-cosmétique": "🧴",
    "Premiers secours": "🩹",
    "Santé au quotidien": "❤️",
};

const categoryColors = [
    "bg-blue-50",
    "bg-green-50",
    "bg-pink-50",
    "bg-purple-50",
    "bg-amber-50",
    "bg-red-50",
];

function Categories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const data = await categorieService.getAll();
            setCategories(data);
        } catch (err) {
            console.error("Erreur chargement catégories:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="bg-slate-50 py-16 md:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                        Explorez nos catégories
                    </h2>
                    <p className="mt-4 text-lg text-slate-600">
                        Des produits de qualité pour toute la famille, disponibles
                        dans les pharmacies partenaires.
                    </p>
                </div>

                {loading ? (
                    <div className="mt-12 flex justify-center py-10">
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
                    </div>
                ) : (
                    <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {categories.map((category, index) => (
                            <Link
                                key={category.id_categorie}
                                to={`/medicaments?categorie=${category.id_categorie}`}
                                className="group flex cursor-pointer items-start gap-4 rounded-2xl border border-slate-100 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg"
                            >
                                <div
                                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl ${
                                        categoryColors[index % categoryColors.length]
                                    }`}
                                >
                                    {categoryIcons[category.nom_categorie] || "💊"}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900">
                                        {category.nom_categorie}
                                    </h3>
                                    {category.description && (
                                        <p className="mt-1 text-sm text-slate-600">
                                            {category.description}
                                        </p>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

export default Categories;