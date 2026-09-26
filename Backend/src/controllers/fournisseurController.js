import {
    creerFournisseur,
    getFournisseurs,
    trouverFournisseur,
    modifierFournisseur,
    supprimerFournisseur
} from "../Models/fournisseurModel.js";

export async function ajouterFournisseur(req, res) {
    try {
        const resultat = await creerFournisseur(req.body);

        res.status(201).json({
            message: "Fournisseur créé avec succès",
            id_fournisseur: resultat.insertId
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function listerFournisseurs(req, res) {
    try {
        const fournisseurs = await getFournisseurs();
        res.json(fournisseurs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function detailFournisseur(req, res) {
    try {
        const fournisseur = await trouverFournisseur(req.params.id);

        if (!fournisseur) {
            return res.status(404).json({ message: "Fournisseur introuvable" });
        }

        res.json(fournisseur);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function modifierUnFournisseur(req, res) {
    try {
        const result = await modifierFournisseur(req.params.id, req.body);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Fournisseur introuvable" });
        }

        res.json({ message: "Fournisseur modifié avec succès" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function supprimerUnFournisseur(req, res) {
    try {
        const result = await supprimerFournisseur(req.params.id);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Fournisseur introuvable" });
        }

        res.json({ message: "Fournisseur supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}