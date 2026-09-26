import express from "express";
import { verifierToken } from "../middleswares/authMiddleswares.js";
import { autoriserRole } from "../middleswares/roleMiddleware.js";
import {
    ajouterLivreur,
    listerLivreurs,
    listerLivreursPharmacie,
    detailLivreur,
    modifierUnLivreur,
    supprimerUnLivreur
} from "../controllers/livreurController.js";

const router = express.Router();

// Routes publiques (lecture)
router.get("/", listerLivreurs);
router.get("/pharmacie/:id_pharmacie", listerLivreursPharmacie);
router.get("/:id", detailLivreur);

// Routes protégées (écriture)
router.post(
    "/",
    verifierToken,
    autoriserRole("SUPER_ADMIN", "ADMIN_PHARMACIE"),
    ajouterLivreur
);

router.put(
    "/:id",
    verifierToken,
    autoriserRole("SUPER_ADMIN", "ADMIN_PHARMACIE"),
    modifierUnLivreur
);

router.delete(
    "/:id",
    verifierToken,
    autoriserRole("SUPER_ADMIN", "ADMIN_PHARMACIE"),
    supprimerUnLivreur
);

export default router;