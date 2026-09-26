import express from "express";

import {
    creerCommande
} from "../controllers/commandeController.js";


import {
    verifierToken
} from "../middleswares/authMiddleswares.js";
import { autoriserRole } from "../middleswares/roleMiddleware.js";
import { uploadOrdonnance } from "../middleswares/uploadMiddleware.js";

import {
    voirCommandesPharmacie
} from "../controllers/consultationCommandeController.js";

import {
    annulerCommande
} from "../controllers/annulationCommandeController.js";


const router = express.Router();



router.post("/", verifierToken, autoriserRole("CLIENT"), uploadOrdonnance.single("ordonnance"), creerCommande);


router.patch(
    "/:id/annuler",
    verifierToken,
    annulerCommande
);


import {
    voirCommande
} from "../controllers/consultationCommandeController.js";

import {
    changerStatut
} from "../controllers/commandeController.js";


router.get(
    "/:id",
    voirCommande
);

router.get(

    "/pharmacie/:id_pharmacie",

    voirCommandesPharmacie

);


router.patch(

    "/:id/statut",

    verifierToken,
    autoriserRole("ADMIN_PHARMACIE", "SUPER_ADMIN"),
    changerStatut

);



export default router;