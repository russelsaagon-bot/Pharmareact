import api from "./api";

export const medicamentService = {
    // Récupérer les médicaments d'une pharmacie
    async getByPharmacie(idPharmacie) {
        const response = await api.get(`/medicaments/pharmacie/${idPharmacie}`);
        return response.data;
    },

    // Récupérer un médicament par ID
    async getById(id) {
        const response = await api.get(`/medicaments/${id}`);
        return response.data;
    },

    // Rechercher des médicaments
    async rechercher(params) {
        const response = await api.get("/client/medicaments/recherche", { params });
        return response.data;
    },

    // Créer un médicament (ADMIN_PHARMACIE)
    async create(medicamentData) {
        const response = await api.post("/medicaments", medicamentData);
        return response.data;
    },

    // Modifier un médicament (ADMIN_PHARMACIE)
    async update(id, medicamentData) {
        const response = await api.put(`/medicaments/${id}`, medicamentData);
        return response.data;
    },

    // Supprimer un médicament (ADMIN_PHARMACIE)
    async delete(id) {
        const response = await api.delete(`/medicaments/${id}`);
        return response.data;
    },
};