import express from "express";
import { verifierToken } from "../middleswares/authMiddleswares.js";
import { autoriserRole } from "../middleswares/roleMiddleware.js";
import {
    modifierProfil,
    voirProfil,
    ajouterAdresse,
    listerAdresses,
    modifierUneAdresse,
    supprimerUneAdresse,
    definirAdressePrincipaleController,
    ajouterAuPanier,
    voirPanier,
    modifierArticlePanier,
    retirerArticlePanier,
    viderLePanier,
    suivreCommande,
    listerCommandesClient,
    rechercherMedicaments
} from "../controllers/clientController.js";

const router = express.Router();

// Profil
router.get(
    "/profil",
    verifierToken,
    autoriserRole("CLIENT", "ADMIN_PHARMACIE", "SUPER_ADMIN"),
    voirProfil
);

router.put(
    "/profil",
    verifierToken,
    autoriserRole("CLIENT", "ADMIN_PHARMACIE", "SUPER_ADMIN"),
    modifierProfil
);

// Adresses
router.post(
    "/adresses",
    verifierToken,
    autoriserRole("CLIENT"),
    ajouterAdresse
);

router.get(
    "/adresses",
    verifierToken,
    autoriserRole("CLIENT"),
    listerAdresses
);

router.put(
    "/adresses/:id",
    verifierToken,
    autoriserRole("CLIENT"),
    modifierUneAdresse
);

router.delete(
    "/adresses/:id",
    verifierToken,
    autoriserRole("CLIENT"),
    supprimerUneAdresse
);

router.patch(
    "/adresses/:id/principale",
    verifierToken,
    autoriserRole("CLIENT"),
    definirAdressePrincipaleController
);

// Panier
router.post(
    "/panier",
    verifierToken,
    autoriserRole("CLIENT"),
    ajouterAuPanier
);

router.get(
    "/panier",
    verifierToken,
    autoriserRole("CLIENT"),
    voirPanier
);

router.patch(
    "/panier/:id_medicament",
    verifierToken,
    autoriserRole("CLIENT"),
    modifierArticlePanier
);

router.delete(
    "/panier/:id_medicament",
    verifierToken,
    autoriserRole("CLIENT"),
    retirerArticlePanier
);

router.delete(
    "/panier",
    verifierToken,
    autoriserRole("CLIENT"),
    viderLePanier
);

// Commandes / Suivi
router.get(
    "/commandes",
    verifierToken,
    autoriserRole("CLIENT"),
    listerCommandesClient
);

router.get(
    "/commandes/:id/suivi",
    verifierToken,
    autoriserRole("CLIENT"),
    suivreCommande
);

// Recherche de médicaments
router.get(
    "/medicaments/recherche",
    rechercherMedicaments
);

export default router;