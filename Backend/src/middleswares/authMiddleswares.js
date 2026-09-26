import { verifierToken as verifyJwt } from "../utils/jwt.js";

export function verifierToken(req, res, next) {

    try {

        const header = req.headers.authorization;

        if (!header) {

            return res.status(401).json({

                message: "Token manquant"

            });

        }

        const token = header.split(" ")[1];

        const payload = verifyJwt(token);

        // Normaliser l'objet utilisateur attendu par les contrôleurs
        const utilisateur = {
            // id_utilisateur ou id_client selon le type
            id_utilisateur: payload.type === "utilisateur" ? payload.id : null,
            id_client: payload.type === "client" ? payload.id : null,
            // rôle : soit donné dans le token, soit 'CLIENT' pour les clients
            role: payload.role ?? (payload.type === "client" ? "CLIENT" : null),
            id_pharmacie: payload.id_pharmacie ?? null,
            // garder la charge originale si besoin
            _raw: payload
        };

        req.utilisateur = utilisateur;

        next();

    } catch (error) {

        return res.status(401).json({

            message: "Token invalide ou expiré"

        });

    }

}