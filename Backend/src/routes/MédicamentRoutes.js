import express from "express";

import { verifierToken } from "../middleswares/authMiddleswares.js";
import { autoriserRole } from "../middleswares/roleMiddleware.js";
import { upload } from "../middleswares/uploadMiddleware.js";

import {
  createMedicament,
  listeMedicaments,
  detailMedicament,
  updateMedicament,
  deleteMedicament,
} from "../controllers/MédicamentController.js";


const router = express.Router();





router.post(
  "/",
  verifierToken,
  autoriserRole("ADMIN_PHARMACIE"),
  upload.single("image"),
  createMedicament
);



router.get(
"/pharmacie/:id_pharmacie",
listeMedicaments
);



router.get(
"/:id",
detailMedicament
);



router.put(
"/:id",
verifierToken,
autoriserRole("ADMIN_PHARMACIE"),
updateMedicament
);


router.delete(
"/:id",
verifierToken,
autoriserRole("ADMIN_PHARMACIE"),
deleteMedicament
);







export default router;