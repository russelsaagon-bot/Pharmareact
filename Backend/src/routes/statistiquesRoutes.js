import express from "express";
import { verifierToken } from "../middleswares/authMiddleswares.js";
import { autoriserRole } from "../middleswares/roleMiddleware.js";
import {
    statistiquesGlobales,
    statistiquesPharmacie,
    ventesParJour,
    medicamentsPopulaires
} from "../controllers/statistiquesController.js";

const router = express.Router();

// Statistiques globales (SUPER_ADMIN uniquement)
router.get(
    "/globales",
    verifierToken,
    autoriserRole("SUPER_ADMIN"),
    statistiquesGlobales
);

// Statistiques par pharmacie
router.get(
    "/pharmacie/:id_pharmacie",
    verifierToken,
    autoriserRole("SUPER_ADMIN", "ADMIN_PHARMACIE"),
    statistiquesPharmacie
);

// Ventes par jour
router.get(
    "/pharmacie/:id_pharmacie/ventes",
    verifierToken,
    autoriserRole("SUPER_ADMIN", "ADMIN_PHARMACIE"),
    ventesParJour
);

// Médicaments populaires
router.get(
    "/pharmacie/:id_pharmacie/medicaments-populaires",
    verifierToken,
    autoriserRole("SUPER_ADMIN", "ADMIN_PHARMACIE"),
    medicamentsPopulaires
);

export default router;