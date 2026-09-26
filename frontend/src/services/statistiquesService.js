 import api from "./api";

export const statistiquesService = {
    // Statistiques globales (SUPER_ADMIN)
    async getGlobales() {
        const response = await api.get("/statistiques/globales");
        return response.data;
    },

    // Statistiques d'une pharmacie
    async getPharmacie(idPharmacie) {
        const response = await api.get(`/statistiques/pharmacie/${idPharmacie}`);
        return response.data;
    },

    // Ventes par jour
    async getVentesParJour(idPharmacie) {
        const response = await api.get(`/statistiques/pharmacie/${idPharmacie}/ventes`);
        return response.data;
    },

    // Médicaments populaires
    async getMedicamentsPopulaires(idPharmacie) {
        const response = await api.get(`/statistiques/pharmacie/${idPharmacie}/medicaments-populaires`);
        return response.data;
    },
};