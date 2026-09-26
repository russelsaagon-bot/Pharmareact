import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
    const [email, setEmail] = useState("");
    const [mot_de_passe, setMotDePasse] = useState("");
    const [error, setError] = useState("");
    const { login, loading } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const data = await login(email, mot_de_passe);
            const role = data.utilisateur?.role;
            if (role === "CLIENT") {
                navigate("/");
            } else if (role === "ADMIN_PHARMACIE") {
                navigate("/admin/pharmacie");
            } else if (role === "SUPER_ADMIN") {
                navigate("/admin/super-admin");
            } else if (role === "LIVREUR") {
                navigate("/livreur");
            } else if (role === "CAISSIERE") {
                navigate("/caissiere");
            } else {
                navigate("/");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Erreur de connexion");
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
                    <h1 className="mt-6 text-3xl font-bold text-slate-900">Connexion</h1>
                    <p className="mt-2 text-slate-600">Accédez à votre compte</p>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-xl shadow-slate-200/50">
                    {error && (
                        <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                placeholder="votre@email.com"
                            />
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                Mot de passe
                            </label>
                            <input
                                type="password"
                                value={mot_de_passe}
                                onChange={(e) => setMotDePasse(e.target.value)}
                                required
                                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? "Connexion..." : "Se connecter"}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-slate-600">
                        Pas encore de compte ?{" "}
                        <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-700">
                            Créer un compte
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;