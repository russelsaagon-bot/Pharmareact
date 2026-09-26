import api from "./api";

export const stockService = {
    // Voir le stock de la pharmacie
    async getStock() {
        const response = await api.get("/stocks");
        return response.data;
    },

    // Voir les alertes de stock faible
    async getAlertes() {
        const response = await api.get("/stocks/alertes");
        return response.data;
    },

    // Voir les mouvements de stock
    async getMouvements() {
        const response = await api.get("/stocks/mouvements");
        return response.data;
    },

    // Voir l'historique des modifications
    async getHistorique() {
        const response = await api.get("/stocks/historique");
        return response.data;
    },

    // Générer le QR code d'un stock
    async genererQr(id) {
        const response = await api.post(`/stocks/${id}/qr-code`);
        return response.data;
    },

    // Modifier la quantité d'un stock
    async modifierQuantite(id, quantite) {
        const response = await api.patch(`/stocks/${id}/quantite`, { quantite });
        return response.data;
    },
};