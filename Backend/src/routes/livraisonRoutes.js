import express from "express";
import { verifierToken } from "../middleswares/authMiddleswares.js";
import { autoriserRole } from "../middleswares/roleMiddleware.js";
import {
    creerLivraison,
    affecterLivreur
} from "../controllers/livraisonController.js";
import {
    changerStatutLivraison
} from "../controllers/livraisonController.js";
import {
    listerLivraisonsLivreur
} from "../controllers/livraisonController.js";


const router = express.Router();



// Création livraison
router.post(
    "/",
    verifierToken,
    autoriserRole("ADMIN_PHARMACIE", "SUPER_ADMIN"),
    creerLivraison
);



// Affecter livreur
router.patch(
    "/:id/livreur",
    verifierToken,
    autoriserRole("ADMIN_PHARMACIE", "SUPER_ADMIN"),
    affecterLivreur
);

router.patch(
    "/:id/statut",
    verifierToken,
    autoriserRole("ADMIN_PHARMACIE", "SUPER_ADMIN", "LIVREUR"),
    changerStatutLivraison
);

// Livreur : voir ses livraisons
router.get(
    "/livreur/mes-livraisons",
    verifierToken,
    autoriserRole("LIVREUR"),
    listerLivraisonsLivreur
);



export default router;