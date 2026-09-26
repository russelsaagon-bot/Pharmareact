import api from "./api";

export const caissiereService = {
    // Récupérer toutes les caissières
    async getAll() {
        const response = await api.get("/caissieres");
        return response.data;
    },

    // Récupérer les caissières d'une pharmacie
    async getByPharmacie(idPharmacie) {
        const response = await api.get(`/caissieres/pharmacie/${idPharmacie}`);
        return response.data;
    },

    // Récupérer une caissière
    async getById(id) {
        const response = await api.get(`/caissieres/${id}`);
        return response.data;
    },

    // Créer une caissière
    async create(caissiereData) {
        const response = await api.post("/caissieres", caissiereData);
        return response.data;
    },

    // Modifier une caissière
    async update(id, caissiereData) {
        const response = await api.put(`/caissieres/${id}`, caissiereData);
        return response.data;
    },

    // Supprimer une caissière
    async delete(id) {
        const response = await api.delete(`/caissieres/${id}`);
        return response.data;
    },

    // Récupérer la caissière connectée
    async getMe() {
        const response = await api.get("/caissieres/me");
        return response.data;
    },
};