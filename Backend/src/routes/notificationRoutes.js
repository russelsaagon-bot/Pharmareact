import express from "express";
import { verifierToken } from "../middleswares/authMiddleswares.js";
import { autoriserRole } from "../middleswares/roleMiddleware.js";
import {
    listerNotifications,
    listerNotificationsNonLues,
    marquerLue,
    marquerToutesLues,
    listerNotificationsPharmacie
} from "../controllers/notificationController.js";

const router = express.Router();

// Lister les notifications de l'utilisateur
router.get(
    "/",
    verifierToken,
    autoriserRole("CLIENT", "ADMIN_PHARMACIE", "SUPER_ADMIN"),
    listerNotifications
);

// Lister les notifications non lues
router.get(
    "/non-lues",
    verifierToken,
    autoriserRole("CLIENT", "ADMIN_PHARMACIE", "SUPER_ADMIN"),
    listerNotificationsNonLues
);

// Marquer une notification comme lue
router.patch(
    "/:id/lue",
    verifierToken,
    autoriserRole("CLIENT", "ADMIN_PHARMACIE", "SUPER_ADMIN"),
    marquerLue
);

// Marquer toutes les notifications comme lues
router.patch(
    "/tout-lu",
    verifierToken,
    autoriserRole("CLIENT", "ADMIN_PHARMACIE", "SUPER_ADMIN"),
    marquerToutesLues
);

// Lister les notifications d'une pharmacie (pour les admins)
router.get(
    "/pharmacie",
    verifierToken,
    autoriserRole("ADMIN_PHARMACIE", "SUPER_ADMIN"),
    listerNotificationsPharmacie
);

export default router;