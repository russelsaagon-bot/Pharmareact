import express from "express";
import { verifierToken } from "../middleswares/authMiddleswares.js";
import { autoriserRole } from "../middleswares/roleMiddleware.js";
import {
    listerUtilisateurs,
    listerUtilisateursPharmacie,
    detailUtilisateur,
    modifierUnUtilisateur,
    supprimerUnUtilisateur,
    listerRoles
} from "../controllers/UserController.js";

const router = express.Router();

// Routes protégées (SUPER_ADMIN uniquement pour la gestion des utilisateurs)
router.get(
    "/",
    verifierToken,
    autoriserRole("SUPER_ADMIN"),
    listerUtilisateurs
);

router.get(
    "/roles",
    verifierToken,
    autoriserRole("SUPER_ADMIN", "ADMIN_PHARMACIE"),
    listerRoles
);

router.get(
    "/pharmacie/:id_pharmacie",
    verifierToken,
    autoriserRole("SUPER_ADMIN", "ADMIN_PHARMACIE"),
    listerUtilisateursPharmacie
);

router.get(
    "/:id",
    verifierToken,
    autoriserRole("SUPER_ADMIN", "ADMIN_PHARMACIE"),
    detailUtilisateur
);

router.put(
    "/:id",
    verifierToken,
    autoriserRole("SUPER_ADMIN"),
    modifierUnUtilisateur
);

router.delete(
    "/:id",
    verifierToken,
    autoriserRole("SUPER_ADMIN"),
    supprimerUnUtilisateur
);

export default router;