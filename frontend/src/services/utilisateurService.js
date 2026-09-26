import api from "./api";

export const utilisateurService = {
    // Lister tous les utilisateurs (SUPER_ADMIN)
    async getAll() {
        const response = await api.get("/utilisateurs");
        return response.data;
    },

    // Lister les rôles
    async getRoles() {
        const response = await api.get("/utilisateurs/roles");
        return response.data;
    },

    // Lister les utilisateurs d'une pharmacie
    async getByPharmacie(idPharmacie) {
        const response = await api.get(`/utilisateurs/pharmacie/${idPharmacie}`);
        return response.data;
    },

    // Détail d'un utilisateur
    async getById(id) {
        const response = await api.get(`/utilisateurs/${id}`);
        return response.data;
    },

    // Modifier un utilisateur (SUPER_ADMIN)
    async update(id, userData) {
        const response = await api.put(`/utilisateurs/${id}`, userData);
        return response.data;
    },

    // Supprimer un utilisateur (SUPER_ADMIN)
    async delete(id) {
        const response = await api.delete(`/utilisateurs/${id}`);
        return response.data;
    },
};