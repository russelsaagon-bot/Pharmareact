import express from "express";
import { verifierToken } from "../middleswares/authMiddleswares.js";
import { autoriserRole } from "../middleswares/roleMiddleware.js";
import {
    ajouterCaissiere,
    listerCaissieres,
    listerCaissieresPharmacie,
    detailCaissiere,
    modifierUneCaissiere,
    supprimerUneCaissiere,
    caissiereParUtilisateur
} from "../controllers/caissiereController.js";

const router = express.Router();

// Routes publiques (lecture)
router.get("/", listerCaissieres);
router.get("/pharmacie/:id_pharmacie", listerCaissieresPharmacie);

// Route protégée - caissière connectée (AVANT /:id pour éviter le conflit)
router.get(
    "/me",
    verifierToken,
    autoriserRole("CAISSIERE"),
    caissiereParUtilisateur
);

router.get("/:id", detailCaissiere);

// Routes protégées (écriture)
router.post(
    "/",
    verifierToken,
    autoriserRole("SUPER_ADMIN", "ADMIN_PHARMACIE"),
    ajouterCaissiere
);

router.put(
    "/:id",
    verifierToken,
    autoriserRole("SUPER_ADMIN", "ADMIN_PHARMACIE"),
    modifierUneCaissiere
);

router.delete(
    "/:id",
    verifierToken,
    autoriserRole("SUPER_ADMIN", "ADMIN_PHARMACIE"),
    supprimerUneCaissiere
);

export default router;