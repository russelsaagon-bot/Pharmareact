import express from "express";
import { verifierToken } from "../middleswares/authMiddleswares.js";
import { autoriserRole } from "../middleswares/roleMiddleware.js";
import {
    tableauDeBordPharmacie,
    voirDisponibiliteLivreurs
} from "../controllers/dashboardController.js";

const router = express.Router();

// Tableau de bord de la pharmacie
router.get(
    "/pharmacie",
    verifierToken,
    autoriserRole("ADMIN_PHARMACIE", "SUPER_ADMIN"),
    tableauDeBordPharmacie
);

// Voir la disponibilité des livreurs
router.get(
    "/livreurs/disponibilite",
    verifierToken,
    autoriserRole("ADMIN_PHARMACIE", "SUPER_ADMIN"),
    voirDisponibiliteLivreurs
);

export default router;