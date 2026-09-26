import express from "express";
import {
  inscription,
  connexion,
  ajouterAdministrateurPharmacie,
  inscriptionClient,
  deconnexion,
  ajouterLivreurCompte,
  ajouterCaissiereCompte,
} from "../controllers/authController.js";
import { verifierToken } from "../middleswares/authMiddleswares.js";
import { autoriserRole } from "../middleswares/roleMiddleware.js";

const router = express.Router();

router.post("/register", inscription);
router.post("/login", connexion);
router.post(
  "/admin-pharmacie",
  verifierToken,
  autoriserRole("SUPER_ADMIN"),
  ajouterAdministrateurPharmacie
);
router.post(
  "/livreur",
  verifierToken,
  autoriserRole("ADMIN_PHARMACIE", "SUPER_ADMIN"),
  ajouterLivreurCompte
);
router.post(
  "/caissiere",
  verifierToken,
  autoriserRole("ADMIN_PHARMACIE", "SUPER_ADMIN"),
  ajouterCaissiereCompte
);
router.post(
"/register-client",
inscriptionClient
);
router.post(
"/logout",
verifierToken,
deconnexion
);

export default router;