import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch {
                localStorage.removeItem("user");
            }
        }
    }, []);

    const login = async (email, mot_de_passe) => {
        setLoading(true);
        try {
            const data = await authService.login(email, mot_de_passe);
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.utilisateur));
            setToken(data.token);
            setUser(data.utilisateur);
            return data;
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData) => {
        setLoading(true);
        try {
            const data = await authService.registerClient(userData);
            return data;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
        } catch {
            // Ignorer les erreurs de déconnexion
        }
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
    };

    const isAuthenticated = !!token;
    const isClient = user?.role === "CLIENT";
    const isAdminPharmacie = user?.role === "ADMIN_PHARMACIE";
    const isSuperAdmin = user?.role === "SUPER_ADMIN";
    const isLivreur = user?.role === "LIVREUR";
    const isCaissiere = user?.role === "CAISSIERE";

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                login,
                register,
                logout,
                isAuthenticated,
                isClient,
                isAdminPharmacie,
                isSuperAdmin,
                isLivreur,
                isCaissiere,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth doit être utilisé dans un AuthProvider");
    }
    return context;
}