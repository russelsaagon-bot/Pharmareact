import express from "express";
import { verifierToken } from "../middleswares/authMiddleswares.js";
import { autoriserRole } from "../middleswares/roleMiddleware.js";
import {
  recupererPharmacies,
  recupererUnePharmacie,
  creerPharmacie,
  modifierUnePharmacie,
  supprimerUnePharmacie,
} from "../controllers/PharmacieController.js";
import upload from "../middleswares/uploadMiddleware.js";

const router = express.Router();
router.get("/", recupererPharmacies);
router.get("/:id", recupererUnePharmacie);
router.post(
  "/",
  verifierToken,
  autoriserRole("SUPER_ADMIN"),
  upload.single("logo"),
  creerPharmacie
);
router.put(
  "/:id",
  verifierToken,
  autoriserRole("SUPER_ADMIN"),
  modifierUnePharmacie
);
router.delete(
  "/:id",
  verifierToken,
  autoriserRole("SUPER_ADMIN"),
  supprimerUnePharmacie
);
export default router;