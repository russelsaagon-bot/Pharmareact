import express from "express";
import { verifierToken } from "../middleswares/authMiddleswares.js";
import { autoriserRole } from "../middleswares/roleMiddleware.js";
import { creerPaiement } from "../controllers/paiementController.js";
import { validerPaiement } from "../controllers/paiementController.js";
import { changerStatutPaiement } from "../controllers/paiementController.js";
import { listerPaiements } from "../controllers/paiementController.js";

const router = express.Router();



router.get(
    "/",
    verifierToken,
    autoriserRole("ADMIN_PHARMACIE", "SUPER_ADMIN", "CAISSIERE"),
    listerPaiements
);

router.post(
    "/",
    verifierToken,
    autoriserRole("CLIENT", "ADMIN_PHARMACIE", "SUPER_ADMIN"),
    creerPaiement
);

router.patch(
    "/:id/valider",
    verifierToken,
    autoriserRole("ADMIN_PHARMACIE", "SUPER_ADMIN"),
    validerPaiement
);

router.patch(
    "/:id/statut",
    verifierToken,
    autoriserRole("ADMIN_PHARMACIE", "SUPER_ADMIN"),
    changerStatutPaiement
);



export default router;