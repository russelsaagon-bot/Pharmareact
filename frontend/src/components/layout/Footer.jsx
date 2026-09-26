import { Link } from "react-router-dom";

const footerLinks = {
    navigation: [
        { to: "/", label: "Accueil" },
        { to: "/pharmacies", label: "Pharmacies" },
        { to: "/medicaments", label: "Médicaments" },
        { to: "/a-propos", label: "À propos" },
    ],
    legal: [
        { to: "/mentions-legales", label: "Mentions légales" },
        { to: "/confidentialite", label: "Confidentialité" },
        { to: "/cgv", label: "CGV" },
    ],
};

function Footer() {
    return (
        <footer className="border-t border-slate-100 bg-slate-50">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
                <div className="grid gap-8 md:grid-cols-4">
                    {/* Logo & description */}
                    <div className="md:col-span-2">
                        <Link to="/" className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white">
                                P
                            </div>
                            <span className="text-xl font-bold tracking-tight text-slate-900">
                                Pharma<span className="text-blue-600">React</span>
                            </span>
                        </Link>
                        <p className="mt-4 max-w-sm text-sm leading-6 text-slate-600">
                            Votre plateforme de santé en ligne. Trouvez vos
                            médicaments, commandez et suivez vos livraisons en
                            toute simplicité.
                        </p>
                    </div>

                    {/* Navigation */}
                    <div>
                        <h3 className="text-sm font-semibold text-slate-900">
                            Navigation
                        </h3>
                        <ul className="mt-4 space-y-3">
                            {footerLinks.navigation.map((link) => (
                                <li key={link.to}>
                                    <Link
                                        to={link.to}
                                        className="text-sm text-slate-600 transition hover:text-blue-600"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Légal */}
                    <div>
                        <h3 className="text-sm font-semibold text-slate-900">
                            Légal
                        </h3>
                        <ul className="mt-4 space-y-3">
                            {footerLinks.legal.map((link) => (
                                <li key={link.to}>
                                    <Link
                                        to={link.to}
                                        className="text-sm text-slate-600 transition hover:text-blue-600"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="mt-12 border-t border-slate-200 pt-6 text-center">
                    <p className="text-sm text-slate-500">
                        © {new Date().getFullYear()} PharmaReact. Tous droits
                        réservés.
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;