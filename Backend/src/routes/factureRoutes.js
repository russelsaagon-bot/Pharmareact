import express from "express";
import { verifierToken } from "../middleswares/authMiddleswares.js";
import { autoriserRole } from "../middleswares/roleMiddleware.js";

import {
    genererFacture
} from "../controllers/factureController.js";

import {
    voirFacture
} from "../controllers/factureController.js";



const router = express.Router();



router.post(
    "/commande/:id",
    verifierToken,
    autoriserRole("ADMIN_PHARMACIE", "SUPER_ADMIN"),
    genererFacture
);

router.get(
    "/:id",
    verifierToken,
    autoriserRole("ADMIN_PHARMACIE", "SUPER_ADMIN"),
    voirFacture
);



export default router;