import {
    creerCaissiere,
    getCaissieres,
    getCaissieresParPharmacie,
    trouverCaissiere,
    trouverCaissiereParUtilisateur,
    modifierCaissiere,
    supprimerCaissiere
} from "../Models/caissiereModel.js";

export async function ajouterCaissiere(req, res) {
    try {
        const data = {
            ...req.body,
            id_pharmacie: req.body.id_pharmacie || req.utilisateur?.id_pharmacie
        };

        const resultat = await creerCaissiere(data);

        res.status(201).json({
            message: "Caissière créée avec succès",
            id_caissiere: resultat.insertId
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function listerCaissieres(req, res) {
    try {
        const caissieres = await getCaissieres();
        res.json(caissieres);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function listerCaissieresPharmacie(req, res) {
    try {
        const caissieres = await getCaissieresParPharmacie(req.params.id_pharmacie);
        res.json(caissieres);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function detailCaissiere(req, res) {
    try {
        const caissiere = await trouverCaissiere(req.params.id);

        if (!caissiere) {
            return res.status(404).json({ message: "Caissière introuvable" });
        }

        res.json(caissiere);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function modifierUneCaissiere(req, res) {
    try {
        const result = await modifierCaissiere(req.params.id, req.body);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Caissière introuvable" });
        }

        res.json({ message: "Caissière modifiée avec succès" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function supprimerUneCaissiere(req, res) {
    try {
        const result = await supprimerCaissiere(req.params.id);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Caissière introuvable" });
        }

        res.json({ message: "Caissière supprimée avec succès" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Récupérer la caissière associée à l'utilisateur connecté
export async function caissiereParUtilisateur(req, res) {
    try {
        const caissiere = await trouverCaissiereParUtilisateur(req.utilisateur?.id_utilisateur);

        if (!caissiere) {
            return res.status(404).json({ message: "Aucune caissière associée à cet utilisateur" });
        }

        res.json(caissiere);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}