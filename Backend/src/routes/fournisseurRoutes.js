import express from "express";
import { verifierToken } from "../middleswares/authMiddleswares.js";
import { autoriserRole } from "../middleswares/roleMiddleware.js";
import {
    ajouterFournisseur,
    listerFournisseurs,
    detailFournisseur,
    modifierUnFournisseur,
    supprimerUnFournisseur
} from "../controllers/fournisseurController.js";

const router = express.Router();

// Routes publiques (lecture)
router.get("/", listerFournisseurs);
router.get("/:id", detailFournisseur);

// Routes protégées (écriture)
router.post(
    "/",
    verifierToken,
    autoriserRole("SUPER_ADMIN", "ADMIN_PHARMACIE"),
    ajouterFournisseur
);

router.put(
    "/:id",
    verifierToken,
    autoriserRole("SUPER_ADMIN", "ADMIN_PHARMACIE"),
    modifierUnFournisseur
);

router.delete(
    "/:id",
    verifierToken,
    autoriserRole("SUPER_ADMIN", "ADMIN_PHARMACIE"),
    supprimerUnFournisseur
);

export default router;