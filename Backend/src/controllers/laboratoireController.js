import {
    creerLaboratoire,
    getLaboratoires,
    trouverLaboratoire,
    modifierLaboratoire,
    supprimerLaboratoire
} from "../Models/laboratoireModel.js";

export async function ajouterLaboratoire(req, res) {
    try {
        const resultat = await creerLaboratoire(req.body);

        res.status(201).json({
            message: "Laboratoire créé avec succès",
            id_laboratoire: resultat.insertId
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function listerLaboratoires(req, res) {
    try {
        const laboratoires = await getLaboratoires();
        res.json(laboratoires);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function detailLaboratoire(req, res) {
    try {
        const laboratoire = await trouverLaboratoire(req.params.id);

        if (!laboratoire) {
            return res.status(404).json({ message: "Laboratoire introuvable" });
        }

        res.json(laboratoire);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function modifierUnLaboratoire(req, res) {
    try {
        const result = await modifierLaboratoire(req.params.id, req.body);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Laboratoire introuvable" });
        }

        res.json({ message: "Laboratoire modifié avec succès" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function supprimerUnLaboratoire(req, res) {
    try {
        const result = await supprimerLaboratoire(req.params.id);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Laboratoire introuvable" });
        }

        res.json({ message: "Laboratoire supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}