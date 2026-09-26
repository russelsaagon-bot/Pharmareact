import express from "express";
import { verifierToken } from "../middleswares/authMiddleswares.js";
import { autoriserRole } from "../middleswares/roleMiddleware.js";
import {
    ajouterCategorie,
    listerCategories,
    detailCategorie,
    modifierUneCategorie,
    supprimerUneCategorie
} from "../controllers/categorieController.js";

const router = express.Router();

// Routes publiques (lecture)
router.get("/", listerCategories);
router.get("/:id", detailCategorie);

// Routes protégées (écriture)
router.post(
    "/",
    verifierToken,
    autoriserRole("SUPER_ADMIN", "ADMIN_PHARMACIE"),
    ajouterCategorie
);

router.put(
    "/:id",
    verifierToken,
    autoriserRole("SUPER_ADMIN", "ADMIN_PHARMACIE"),
    modifierUneCategorie
);

router.delete(
    "/:id",
    verifierToken,
    autoriserRole("SUPER_ADMIN", "ADMIN_PHARMACIE"),
    supprimerUneCategorie
);

export default router;