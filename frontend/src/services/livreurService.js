import api from "./api";

export const livreurService = {
    // Récupérer tous les livreurs
    async getAll() {
        const response = await api.get("/livreurs");
        return response.data;
    },

    // Récupérer les livreurs d'une pharmacie
    async getByPharmacie(idPharmacie) {
        const response = await api.get(`/livreurs/pharmacie/${idPharmacie}`);
        return response.data;
    },

    // Récupérer un livreur
    async getById(id) {
        const response = await api.get(`/livreurs/${id}`);
        return response.data;
    },

    // Créer un livreur
    async create(livreurData) {
        const response = await api.post("/livreurs", livreurData);
        return response.data;
    },

    // Modifier un livreur
    async update(id, livreurData) {
        const response = await api.put(`/livreurs/${id}`, livreurData);
        return response.data;
    },

    // Supprimer un livreur
    async delete(id) {
        const response = await api.delete(`/livreurs/${id}`);
        return response.data;
    },

    // Récupérer les livraisons du livreur connecté
    async getMesLivraisons() {
        const response = await api.get("/livraisons/livreur/mes-livraisons");
        return response.data;
    },

    // Changer le statut d'une livraison
    async changerStatutLivraison(id, statut) {
        const response = await api.patch(`/livraisons/${id}/statut`, { statut });
        return response.data;
    },
};