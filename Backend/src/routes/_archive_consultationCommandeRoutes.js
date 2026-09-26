// Archived: This route file is kept for reference but is not mounted in `src/server.js`.
// It was kept to avoid accidental loss of work; active routes live in `commandeRoutes.js`.
import express from "express";


import {
    voirCommande
} from "../controllers/consultationCommandeController.js";


const router = express.Router();


router.get(

    "/:id",

    voirCommande

);


export default router;
