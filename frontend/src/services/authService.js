import api from "./api";

export const authService = {
    // Connexion
    async login(email, mot_de_passe) {
        const response = await api.post("/auth/login", { email, mot_de_passe });
        return response.data;
    },

    // Inscription utilisateur
    async register(userData) {
        const response = await api.post("/auth/register", userData);
        return response.data;
    },

    // Inscription client
    async registerClient(clientData) {
        const response = await api.post("/auth/register-client", clientData);
        return response.data;
    },

    // Ajouter un administrateur pharmacie (SUPER_ADMIN)
    async registerAdminPharmacie(adminData) {
        const response = await api.post("/auth/admin-pharmacie", adminData);
        return response.data;
    },

    // Ajouter un livreur (ADMIN_PHARMACIE)
    async registerLivreur(livreurData) {
        const response = await api.post("/auth/livreur", livreurData);
        return response.data;
    },

    // Ajouter une caissière (ADMIN_PHARMACIE)
    async registerCaissiere(caissiereData) {
        const response = await api.post("/auth/caissiere", caissiereData);
        return response.data;
    },

    // Déconnexion
    async logout() {
        const response = await api.post("/auth/logout");
        return response.data;
    },
};