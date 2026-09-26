import api from "./api";

export const notificationService = {
    // Lister les notifications de l'utilisateur
    async getAll() {
        const response = await api.get("/notifications");
        return response.data;
    },

    // Lister les notifications non lues
    async getNonLues() {
        const response = await api.get("/notifications/non-lues");
        return response.data;
    },

    // Marquer une notification comme lue
    async marquerLue(id) {
        const response = await api.patch(`/notifications/${id}/lue`);
        return response.data;
    },

    // Marquer toutes les notifications comme lues
    async marquerToutesLues() {
        const response = await api.patch("/notifications/tout-lu");
        return response.data;
    },

    // Lister les notifications d'une pharmacie
    async getPharmacie() {
        const response = await api.get("/notifications/pharmacie");
        return response.data;
    },
};