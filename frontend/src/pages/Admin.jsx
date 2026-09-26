import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Admin() {
    const { isAuthenticated, isSuperAdmin, isAdminPharmacie } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login");
            return;
        }
        if (isSuperAdmin) {
            navigate("/admin/super-admin");
        } else if (isAdminPharmacie) {
            navigate("/admin/pharmacie");
        } else {
            navigate("/");
        }
    }, [isAuthenticated, isSuperAdmin, isAdminPharmacie, navigate]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        </div>
    );
}

export default Admin;