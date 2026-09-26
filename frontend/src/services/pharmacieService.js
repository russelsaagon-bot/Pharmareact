import api from "./api";

export const pharmacieService = {
    // Récupérer toutes les pharmacies
    async getAll() {
        const response = await api.get("/pharmacies");
        return response.data;
    },

    // Récupérer une pharmacie par ID
    async getById(id) {
        const response = await api.get(`/pharmacies/${id}`);
        return response.data;
    },

    // Créer une pharmacie (SUPER_ADMIN)
    async create(pharmacieData) {
        const response = await api.post("/pharmacies", pharmacieData);
        return response.data;
    },

    // Modifier une pharmacie (SUPER_ADMIN)
    async update(id, pharmacieData) {
        const response = await api.put(`/pharmacies/${id}`, pharmacieData);
        return response.data;
    },

    // Supprimer une pharmacie (SUPER_ADMIN)
    async delete(id) {
        const response = await api.delete(`/pharmacies/${id}`);
        return response.data;
    },
};