import api from "./api";

export const clientService = {
    // Profil
    async getProfil() {
        const response = await api.get("/client/profil");
        return response.data;
    },

    async updateProfil(profilData) {
        const response = await api.put("/client/profil", profilData);
        return response.data;
    },

    // Adresses
    async getAdresses() {
        const response = await api.get("/client/adresses");
        return response.data;
    },

    async addAdresse(adresseData) {
        const response = await api.post("/client/adresses", adresseData);
        return response.data;
    },

    async updateAdresse(id, adresseData) {
        const response = await api.put(`/client/adresses/${id}`, adresseData);
        return response.data;
    },

    async deleteAdresse(id) {
        const response = await api.delete(`/client/adresses/${id}`);
        return response.data;
    },

    async setAdressePrincipale(id) {
        const response = await api.patch(`/client/adresses/${id}/principale`);
        return response.data;
    },

    // Panier
    async getPanier() {
        const response = await api.get("/client/panier");
        return response.data;
    },

    async addToPanier(id_medicament, quantite) {
        const response = await api.post("/client/panier", { id_medicament, quantite });
        return response.data;
    },

    async updatePanierItem(id_medicament, quantite) {
        const response = await api.patch(`/client/panier/${id_medicament}`, { quantite });
        return response.data;
    },

    async removeFromPanier(id_medicament) {
        const response = await api.delete(`/client/panier/${id_medicament}`);
        return response.data;
    },

    async clearPanier() {
        const response = await api.delete("/client/panier");
        return response.data;
    },
    // Commandes
    async getCommandes() {
        const response = await api.get("/client/commandes");
        return response.data;
    },

};