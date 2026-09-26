import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Pharmacies from "./pages/Pharmacies";
import PharmacieDetail from "./pages/PharmacieDetail";
import Medicaments from "./pages/Medicaments";
import Panier from "./pages/Panier";
import Commande from "./pages/Commande";
import SuiviCommande from "./pages/SuiviCommande";
import Profil from "./pages/Profil";
import Admin from "./pages/Admin";
import SuperAdmin from "./pages/SuperAdmin";
import AdminPharmacie from "./pages/AdminPharmacie";
import LivreurMobile from "./pages/LivreurMobile";
import Caissiere from "./pages/Caissiere";
import MesCommandes from "./pages/MesCommandes";

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/pharmacies" element={<Pharmacies />} />
                    <Route path="/pharmacies/:id" element={<PharmacieDetail />} />
                    <Route path="/medicaments" element={<Medicaments />} />
                    <Route path="/panier" element={<Panier />} />
                    <Route path="/commande" element={<Commande />} />
                    <Route path="/suivi/:id" element={<SuiviCommande />} />


                    <Route path="/mes-commandes" element={<MesCommandes />} />

                    <Route path="/profil" element={<Profil />} />

                    {/* Administration */}
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/admin/super-admin" element={<SuperAdmin />} />
                    <Route path="/admin/pharmacie" element={<AdminPharmacie />} />

                    {/* Livreur mobile */}
                    <Route path="/livreur" element={<LivreurMobile />} />

                    {/* Caissière */}
                    <Route path="/caissiere" element={<Caissiere />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;