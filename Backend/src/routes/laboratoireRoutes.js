import express from "express";
import { verifierToken } from "../middleswares/authMiddleswares.js";
import { autoriserRole } from "../middleswares/roleMiddleware.js";
import {
    ajouterLaboratoire,
    listerLaboratoires,
    detailLaboratoire,
    modifierUnLaboratoire,
    supprimerUnLaboratoire
} from "../controllers/laboratoireController.js";

const router = express.Router();

// Routes publiques (lecture)
router.get("/", listerLaboratoires);
router.get("/:id", detailLaboratoire);

// Routes protégées (écriture)
router.post(
    "/",
    verifierToken,
    autoriserRole("SUPER_ADMIN", "ADMIN_PHARMACIE"),
    ajouterLaboratoire
);

router.put(
    "/:id",
    verifierToken,
    autoriserRole("SUPER_ADMIN", "ADMIN_PHARMACIE"),
    modifierUnLaboratoire
);

router.delete(
    "/:id",
    verifierToken,
    autoriserRole("SUPER_ADMIN", "ADMIN_PHARMACIE"),
    supprimerUnLaboratoire
);

export default router;