import {
    creerCategorie,
    getCategories,
    trouverCategorie,
    modifierCategorie,
    supprimerCategorie
} from "../Models/categorieModel.js";

export async function ajouterCategorie(req, res) {
    try {
        const resultat = await creerCategorie(req.body);

        res.status(201).json({
            message: "Catégorie créée avec succès",
            id_categorie: resultat.insertId
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function listerCategories(req, res) {
    try {
        const categories = await getCategories();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function detailCategorie(req, res) {
    try {
        const categorie = await trouverCategorie(req.params.id);

        if (!categorie) {
            return res.status(404).json({ message: "Catégorie introuvable" });
        }

        res.json(categorie);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function modifierUneCategorie(req, res) {
    try {
        const result = await modifierCategorie(req.params.id, req.body);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Catégorie introuvable" });
        }

        res.json({ message: "Catégorie modifiée avec succès" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function supprimerUneCategorie(req, res) {
    try {
        const result = await supprimerCategorie(req.params.id);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Catégorie introuvable" });
        }

        res.json({ message: "Catégorie supprimée avec succès" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}