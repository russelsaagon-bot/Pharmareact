import {
    getUtilisateurs,
    getUtilisateursParPharmacie,
    trouverUtilisateurParId,
    modifierUtilisateur,
    supprimerUtilisateur,
    getRoles
} from "../Models/UserModel.js";

export async function listerUtilisateurs(req, res) {
    try {
        const utilisateurs = await getUtilisateurs();
        res.json(utilisateurs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function listerUtilisateursPharmacie(req, res) {
    try {
        const utilisateurs = await getUtilisateursParPharmacie(req.params.id_pharmacie);
        res.json(utilisateurs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function detailUtilisateur(req, res) {
    try {
        const utilisateur = await trouverUtilisateurParId(req.params.id);

        if (!utilisateur) {
            return res.status(404).json({ message: "Utilisateur introuvable" });
        }

        res.json(utilisateur);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function modifierUnUtilisateur(req, res) {
    try {
        const result = await modifierUtilisateur(req.params.id, req.body);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Utilisateur introuvable" });
        }

        res.json({ message: "Utilisateur modifié avec succès" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function supprimerUnUtilisateur(req, res) {
    try {
        const result = await supprimerUtilisateur(req.params.id);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Utilisateur introuvable" });
        }

        res.json({ message: "Utilisateur supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function listerRoles(req, res) {
    try {
        const roles = await getRoles();
        res.json(roles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}