import express from "express";
import { verifierToken } from "../middleswares/authMiddleswares.js";
import { autoriserRole } from "../middleswares/roleMiddleware.js";
import {
    voirStock,
    voirAlertesStock,
    voirMouvementsStock,
    voirHistoriqueStock,
    genererQrStock,
    modifierQuantiteStock
} from "../controllers/stockController.js";

const router = express.Router();

// Voir le stock de la pharmacie
router.get(
    "/",
    verifierToken,
    autoriserRole("ADMIN_PHARMACIE", "SUPER_ADMIN"),
    voirStock
);

// Voir les alertes de stock faible
router.get(
    "/alertes",
    verifierToken,
    autoriserRole("ADMIN_PHARMACIE", "SUPER_ADMIN"),
    voirAlertesStock
);

// Voir l'historique des mouvements de stock
router.get(
    "/mouvements",
    verifierToken,
    autoriserRole("ADMIN_PHARMACIE", "SUPER_ADMIN"),
    voirMouvementsStock
);

// Voir l'historique des modifications de stock
router.get(
    "/historique",
    verifierToken,
    autoriserRole("ADMIN_PHARMACIE", "SUPER_ADMIN"),
    voirHistoriqueStock
);

// Générer le QR code d'un stock
router.post(
    "/:id/qr-code",
    verifierToken,
    autoriserRole("ADMIN_PHARMACIE", "SUPER_ADMIN"),
    genererQrStock
);

// Modifier la quantité d'un stock
router.patch(
    "/:id/quantite",
    verifierToken,
    autoriserRole("ADMIN_PHARMACIE", "SUPER_ADMIN"),
    modifierQuantiteStock
);

export default router;