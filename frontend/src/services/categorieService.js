import api from "./api";

export const categorieService = {
    // Récupérer toutes les catégories
    async getAll() {
        const response = await api.get("/categories");
        return response.data;
    },

    // Récupérer une catégorie par ID
    async getById(id) {
        const response = await api.get(`/categories/${id}`);
        return response.data;
    },

    // Créer une catégorie
    async create(categorieData) {
        const response = await api.post("/categories", categorieData);
        return response.data;
    },

    // Modifier une catégorie
    async update(id, categorieData) {
        const response = await api.put(`/categories/${id}`, categorieData);
        return response.data;
    },

    // Supprimer une catégorie
    async delete(id) {
        const response = await api.delete(`/categories/${id}`);
        return response.data;
    },
};