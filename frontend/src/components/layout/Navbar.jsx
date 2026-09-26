import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { isAuthenticated, user, logout, isClient, isAdminPharmacie, isSuperAdmin, isLivreur, isCaissiere } = useAuth();
    const navigate = useNavigate();

    // Si l'utilisateur connecté est Administrateur (Admin pharmacie ou Super Admin), on ne montre pas "Pharmacies" dans le nav
    const isAdmin = isAdminPharmacie || isSuperAdmin;

    const navLinks = [
        { to: "/", label: "Accueil" },
        ...(!isAdmin ? [{ to: "/pharmacies", label: "Pharmacies" }] : []),
        { to: "/medicaments", label: "Médicaments" },
    ];

    const handleLogout = async () => {
        await logout();
        navigate("/");
    };

    return (
        <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur">
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold text-white">
                        P
                    </div>
                    <div>
                        <span className="block text-xl font-bold tracking-tight text-slate-900">
                            Pharma<span className="text-blue-600">React</span>
                        </span>
                        <span className="hidden text-xs text-slate-500 sm:block">
                            Votre santé, simplement.
                        </span>
                    </div>
                </Link>

                {/* Navigation desktop */}
                <div className="hidden items-center gap-8 lg:flex">
                    {navLinks.map((link) => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className={`text-sm font-medium transition ${
                                link.to === "/"
                                    ? "text-blue-600"
                                    : "text-slate-600 hover:text-blue-600"
                            }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                    {isAuthenticated && (
                        <>
                            {isClient && (
                                <Link
                                    to="/panier"
                                    className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
                                >
                                    🛒 Panier
                                </Link>
                            )}
                                    <Link
                                        to="/mes-commandes"
                                        className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
                                    >
                                        📦 Mes commandes
                                    </Link>

            {(isAdminPharmacie || isSuperAdmin) && (
                <Link
                    to={isSuperAdmin ? "/admin/super-admin" : "/admin/pharmacie"}
                    className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
                >
                    📊 Admin
                </Link>
            )}
            {isLivreur && (
                <Link
                    to="/livreur"
                    className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
                >
                    🛵 Livreur
                </Link>
            )}
            {isCaissiere && (
                <Link
                    to="/caissiere"
                    className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
                >
                    💰 Caisse
                </Link>
            )}
                        </>
                    )}
                </div>

                {/* Actions desktop */}
                <div className="hidden items-center gap-3 sm:flex">
                    {isAuthenticated ? (
                        <>
                            <Link
                                to="/profil"
                                className="px-4 py-2 text-sm font-semibold text-slate-700 transition hover:text-blue-600"
                            >
                                👤 {user?.nom || "Profil"}
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                            >
                                Déconnexion
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="px-4 py-2 text-sm font-semibold text-slate-700 transition hover:text-blue-600"
                            >
                                Connexion
                            </Link>
                            <Link
                                to="/register"
                                className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                            >
                                Créer un compte
                            </Link>
                        </>
                    )}
                </div>

                {/* Bouton mobile */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="rounded-lg p-2 text-slate-700 transition hover:bg-slate-100 sm:hidden"
                    aria-label="Ouvrir le menu"
                >
                    {isOpen ? (
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    )}
                </button>
            </nav>

            {/* Menu mobile */}
            {isOpen && (
                <div className="border-t border-slate-100 bg-white px-4 pb-6 pt-4 sm:hidden">
                    <div className="flex flex-col gap-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                onClick={() => setIsOpen(false)}
                                className={`rounded-lg px-4 py-3 text-sm font-medium transition ${
                                    link.to === "/"
                                        ? "bg-blue-50 text-blue-600"
                                        : "text-slate-600 hover:bg-slate-50"
                                }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                        {isAuthenticated && isClient && (
                            <Link
                                to="/panier"
                                onClick={() => setIsOpen(false)}
                                className="rounded-lg px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
                            >
                                🛒 Panier
                            </Link>
                        )}
                        {isAuthenticated && (isAdminPharmacie || isSuperAdmin) && (
                            <Link
                                to={isSuperAdmin ? "/admin/super-admin" : "/admin/pharmacie"}
                                onClick={() => setIsOpen(false)}
                                className="rounded-lg px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
                            >
                                📊 Admin
                            </Link>
                        )}
                        {isAuthenticated && isLivreur && (
                            <Link
                                to="/livreur"
                                onClick={() => setIsOpen(false)}
                                className="rounded-lg px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
                            >
                                🛵 Livreur
                            </Link>
                        )}
                        {isAuthenticated && isCaissiere && (
                            <Link
                                to="/caissiere"
                                onClick={() => setIsOpen(false)}
                                className="rounded-lg px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
                            >
                                💰 Caisse
                            </Link>
                        )}
                    </div>
                    <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4">
                        {isAuthenticated ? (
                            <>
                                <Link
                                    to="/profil"
                                    onClick={() => setIsOpen(false)}
                                    className="rounded-xl border border-slate-200 px-5 py-2.5 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                                >
                                    👤 {user?.nom || "Profil"}
                                </Link>
                                <button
                                    onClick={() => {
                                        setIsOpen(false);
                                        handleLogout();
                                    }}
                                    className="rounded-xl bg-red-600 px-5 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-red-700"
                                >
                                    Déconnexion
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    onClick={() => setIsOpen(false)}
                                    className="rounded-xl border border-slate-200 px-5 py-2.5 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                                >
                                    Connexion
                                </Link>
                                <Link
                                    to="/register"
                                    onClick={() => setIsOpen(false)}
                                    className="rounded-xl bg-green-600 px-5 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                                >
                                    Créer un compte
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}

export default Navbar;