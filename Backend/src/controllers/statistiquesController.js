import {
    getStatistiquesGlobales,
    getStatistiquesPharmacie,
    getVentesParJour,
    getMedicamentsPopulaires
} from "../services/statistiquesService.js";

export async function statistiquesGlobales(req, res) {
    try {
        const stats = await getStatistiquesGlobales();
        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function statistiquesPharmacie(req, res) {
    try {
        const id_pharmacie = req.params.id_pharmacie;
        const stats = await getStatistiquesPharmacie(id_pharmacie);
        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function ventesParJour(req, res) {
    try {
        const id_pharmacie = req.params.id_pharmacie;
        const jours = parseInt(req.query.jours) || 7;
        const ventes = await getVentesParJour(id_pharmacie, jours);
        res.json(ventes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function medicamentsPopulaires(req, res) {
    try {
        const id_pharmacie = req.params.id_pharmacie;
        const limite = parseInt(req.query.limite) || 5;
        const medicaments = await getMedicamentsPopulaires(id_pharmacie, limite);
        res.json(medicaments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}