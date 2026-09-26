import express from "express";
import { verifierToken } from "../middleswares/authMiddleswares.js";
import { autoriserRole } from "../middleswares/roleMiddleware.js";
import {
    voirToutesCommandes,
    voirTousPaiements,
    voirToutesFactures,
    voirToutesLivraisons,
    voirJournalActivite,
    changerStatutPharmacie
} from "../controllers/superAdminController.js";

const router = express.Router();

// Voir toutes les commandes
router.get(
    "/commandes",
    verifierToken,
    autoriserRole("SUPER_ADMIN"),
    voirToutesCommandes
);

// Voir tous les paiements
router.get(
    "/paiements",
    verifierToken,
    autoriserRole("SUPER_ADMIN"),
    voirTousPaiements
);

// Voir toutes les factures
router.get(
    "/factures",
    verifierToken,
    autoriserRole("SUPER_ADMIN"),
    voirToutesFactures
);

// Voir toutes les livraisons
router.get(
    "/livraisons",
    verifierToken,
    autoriserRole("SUPER_ADMIN"),
    voirToutesLivraisons
);

// Consulter le journal d'activité
router.get(
    "/journal",
    verifierToken,
    autoriserRole("SUPER_ADMIN"),
    voirJournalActivite
);

// Désactiver / activer une pharmacie
router.patch(
    "/pharmacies/:id/statut",
    verifierToken,
    autoriserRole("SUPER_ADMIN"),
    changerStatutPharmacie
);

export default router;