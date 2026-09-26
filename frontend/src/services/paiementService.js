import api from "./api";

export const paiementService = {
    // Récupérer tous les paiements
    async getAll() {
        const response = await api.get("/paiements");
        return response.data;
    },

    // Créer un paiement
    async create(paiementData) {
        const response = await api.post("/paiements", paiementData);
        return response.data;
    },

    // Valider un paiement
    async valider(id, reference_transaction) {
        const response = await api.patch(`/paiements/${id}/valider`, { reference_transaction });
        return response.data;
    },

    // Changer le statut d'un paiement
    async changerStatut(id, statut, reference_transaction) {
        const response = await api.patch(`/paiements/${id}/statut`, { statut, reference_transaction });
        return response.data;
    },

    // Paiement mobile money
    async payerMobileMoney(data) {
        const response = await api.post("/mobile-money/payer", data);
        return response.data;
    },

    // Vérifier le statut d'un paiement mobile money
    async verifierStatutMobileMoney(id) {
        const response = await api.get(`/mobile-money/statut/${id}`);
        return response.data;
    },
};