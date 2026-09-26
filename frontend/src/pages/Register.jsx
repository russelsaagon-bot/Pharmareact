import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Register() {
    const [formData, setFormData] = useState({
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
        mot_de_passe: "",
        confirm_mot_de_passe: "",
    });
    const [error, setError] = useState("");
    const { register, loading } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (formData.mot_de_passe !== formData.confirm_mot_de_passe) {
            setError("Les mots de passe ne correspondent pas");
            return;
        }

        try {
            const { confirm_mot_de_passe, ...data } = formData;
            await register(data);
            navigate("/login", { state: { message: "Compte créé avec succès ! Veuillez vous connecter." } });
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de l'inscription");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-50 to-white px-4 py-12">
            <div className="w-full max-w-md">
                <div className="mb-8 text-center">
                    <Link to="/" className="inline-flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold text-white">
                            P
                        </div>
                        <span className="text-2xl font-bold text-slate-900">
                            Pharma<span className="text-blue-600">React</span>
                        </span>
                    </Link>
                    <h1 className="mt-6 text-3xl font-bold text-slate-900">Créer un compte</h1>
                    <p className="mt-2 text-slate-600">Rejoignez PharmaReact</p>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-xl shadow-slate-200/50">
                    {error && (
                        <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                    Nom
                                </label>
                                <input
                                    type="text"
                                    name="nom"
                                    value={formData.nom}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    placeholder="Dupont"
                                />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                    Prénom
                                </label>
                                <input
                                    type="text"
                                    name="prenom"
                                    value={formData.prenom}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    placeholder="Jean"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                placeholder="votre@email.com"
                            />
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                Téléphone
                            </label>
                            <input
                                type="tel"
                                name="telephone"
                                value={formData.telephone}
                                onChange={handleChange}
                                required
                                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                placeholder="+237 6XX XX XX XX"
                            />
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                Mot de passe
                            </label>
                            <input
                                type="password"
                                name="mot_de_passe"
                                value={formData.mot_de_passe}
                                onChange={handleChange}
                                required
                                minLength={6}
                                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                placeholder="••••••••"
                            />
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                Confirmer le mot de passe
                            </label>
                            <input
                                type="password"
                                name="confirm_mot_de_passe"
                                value={formData.confirm_mot_de_passe}
                                onChange={handleChange}
                                required
                                minLength={6}
                                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? "Création..." : "Créer mon compte"}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-slate-600">
                        Déjà un compte ?{" "}
                        <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700">
                            Se connecter
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Register;