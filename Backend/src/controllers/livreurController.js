import {
    creerLivreur,
    getLivreurs,
    getLivreursParPharmacie,
    trouverLivreur,
    modifierLivreur,
    supprimerLivreur
} from "../Models/livreurModel.js";

export async function ajouterLivreur(req, res) {
    try {
        const data = {
            ...req.body,
            id_pharmacie: req.body.id_pharmacie || req.utilisateur?.id_pharmacie
        };

        const resultat = await creerLivreur(data);

        res.status(201).json({
            message: "Livreur créé avec succès",
            id_livreur: resultat.insertId
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function listerLivreurs(req, res) {
    try {
        const livreurs = await getLivreurs();
        res.json(livreurs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function listerLivreursPharmacie(req, res) {
    try {
        const livreurs = await getLivreursParPharmacie(req.params.id_pharmacie);
        res.json(livreurs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function detailLivreur(req, res) {
    try {
        const livreur = await trouverLivreur(req.params.id);

        if (!livreur) {
            return res.status(404).json({ message: "Livreur introuvable" });
        }

        res.json(livreur);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function modifierUnLivreur(req, res) {
    try {
        const result = await modifierLivreur(req.params.id, req.body);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Livreur introuvable" });
        }

        res.json({ message: "Livreur modifié avec succès" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function supprimerUnLivreur(req, res) {
    try {
        const result = await supprimerLivreur(req.params.id);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Livreur introuvable" });
        }

        res.json({ message: "Livreur supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}