 import api from "./api";

export const commandeService = {
    // Créer une commande (CLIENT)
    async create(commandeData) {
        const response = await api.post("/commandes", commandeData);
        return response.data;
    },

    // Voir une commande
    async getById(id) {
        const response = await api.get(`/commandes/${id}`);
        return response.data;
    },

    // Voir les commandes d'une pharmacie
    async getByPharmacie(idPharmacie) {
        const response = await api.get(`/commandes/pharmacie/${idPharmacie}`);
        return response.data;
    },

    // Annuler une commande
    async annuler(id) {
        const response = await api.patch(`/commandes/${id}/annuler`);
        return response.data;
    },

    // Changer le statut d'une commande
    async changerStatut(id, statut) {
        const response = await api.patch(`/commandes/${id}/statut`, { statut });
        return response.data;
    },

    // Suivre une commande (CLIENT)
    async suivre(id) {
        const response = await api.get(`/client/commandes/${id}/suivi`);
        return response.data;
    },
};