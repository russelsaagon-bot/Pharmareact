import express from "express";

         import {

ajouterApprovisionnement,
listeApprovisionnements,
detailApprovisionnement,
annulerApprovisionnement,

} from "../controllers/approvisionnementController.js";


import { verifierToken } 
from "../middleswares/authMiddleswares.js";

import { autoriserRole } 
from "../middleswares/roleMiddleware.js";


const router = express.Router();



// Ajouter un approvisionnement

router.post(
    "/",
    verifierToken,
    autoriserRole("ADMIN_PHARMACIE"),
    ajouterApprovisionnement
);


router.get(

"/",

verifierToken,

autoriserRole("ADMIN_PHARMACIE"),

listeApprovisionnements

);


router.get(

"/:id",

verifierToken,

autoriserRole("ADMIN_PHARMACIE"),

detailApprovisionnement

);

router.delete(

"/:id",

verifierToken,

autoriserRole("ADMIN_PHARMACIE"),

annulerApprovisionnement

);



export default router;