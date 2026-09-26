import express from "express";
import { verifierToken } from "../middleswares/authMiddleswares.js";
import { autoriserRole } from "../middleswares/roleMiddleware.js";
import {
  initierPaiementMobile,
  verifierStatutPaiement,
  webhookMTN,
  webhookOrange
} from "../controllers/mobileMoneyController.js";

const router = express.Router();

// Initier un paiement mobile money (MTN MoMo ou Orange Money)
router.post(
  "/payer",
  verifierToken,
  autoriserRole("CLIENT", "ADMIN_PHARMACIE", "SUPER_ADMIN"),
  initierPaiementMobile
);

// Vérifier le statut d'un paiement mobile money
router.get(
  "/statut/:id",
  verifierToken,
  autoriserRole("CLIENT", "ADMIN_PHARMACIE", "SUPER_ADMIN"),
  verifierStatutPaiement
);

// Webhook MTN MoMo (callback - pas d'authentification, appelé par MTN)
router.post("/webhook/mtn", webhookMTN);

// Webhook Orange Money (callback - pas d'authentification, appelé par Orange)
router.post("/webhook/orange", webhookOrange);

export default router;