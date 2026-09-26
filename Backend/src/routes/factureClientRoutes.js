import express from "express";
import { verifierToken } from "../middleswares/authMiddleswares.js";
import { autoriserRole } from "../middleswares/roleMiddleware.js";
import {
    telechargerFacture,
    scannerQrFacture
} from "../controllers/factureClientController.js";

const router = express.Router();

// Télécharger une facture
router.get(
    "/:id/telecharger",
    verifierToken,
    autoriserRole("CLIENT", "ADMIN_PHARMACIE", "SUPER_ADMIN"),
    telechargerFacture
);

// Scanner le QR code d'une facture
router.get(
    "/qr/:numero_facture",
    scannerQrFacture
);

export default router;