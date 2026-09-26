import bcrypt from "bcrypt";

import {
    trouverUtilisateurParEmail,
    trouverClientParEmail
} from "../Models/authModel.js";

import { genererToken } from "../utils/jwt.js";

export async function loginService(email, mot_de_passe) {

// Recherche administrateur
    let utilisateur = await trouverUtilisateurParEmail(email);
    let type = "utilisateur";

    // Si pas trouvé, chercher dans la table des clients (qui sont aussi des utilisateurs avec rôle CLIENT)
    if (!utilisateur) {
        utilisateur = await trouverClientParEmail(email);
        type = "client";
    }

    if (!utilisateur) {
        throw new Error("Email ou mot de passe incorrect");
    }

    const motDePasseValide = await bcrypt.compare(

        mot_de_passe,

        utilisateur.mot_de_passe

    );

    if (!motDePasseValide) {

        throw new Error("Email ou mot de passe incorrect");

    }

    const payload = {

        id: utilisateur.id_utilisateur,

        type

    };

    if (type === "utilisateur") {

        payload.role = utilisateur.nom_role;
        payload.id_pharmacie = utilisateur.id_pharmacie;

    }

    const token = genererToken(payload);

    return {

        token,

        utilisateur: {

            id: payload.id,

            type,

            nom: utilisateur.nom,

            prenom: utilisateur.prenom,

            email: utilisateur.email,

            role: payload.role ?? null,

            id_pharmacie: payload.id_pharmacie ?? null

        }

    };

}