import {
  getAllPharmacies,
  getPharmacieById,
  creerPharmacie as creerPharmacieModel,
  modifierPharmacie,
  supprimerPharmacie,
} from "../Models/PharmacieModel.js";
import { genererQRCode } from "../utils/generateQr.js";
import pool from "../config/database.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function recupererUnePharmacie(req, res) {

    try {

        const pharmacie = await getPharmacieById(req.params.id);

        if (!pharmacie) {

            return res.status(404).json({

                message: "Pharmacie introuvable"

            });

        }

        res.json(pharmacie);

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

}

export async function creerPharmacie(req, res) {

    try {

        const logo = req.file ? req.file.path : null;

        const nouvellePharmacie = {
            nom_pharmacie: req.body.nom_pharmacie,
            logo,
            telephone: req.body.telephone,
            email: req.body.email,
            adresse: req.body.adresse,
            ville: req.body.ville,
            pays: req.body.pays,
            horaires: req.body.horaires,
            quartier: req.body.quartier,
            est_de_garde: req.body.est_de_garde,
            qr_code: null,
        };

        const resultat = await creerPharmacieModel(nouvellePharmacie);

        const id = resultat.insertId;
        const qrDataUrl = await genererQRCode(`PHARMACIE_${id}`);

        // Sauvegarder le QR code en fichier
        const dossierQr = path.join(__dirname, "..", "Upload", "qrcodes");
        if (!fs.existsSync(dossierQr)) {
            fs.mkdirSync(dossierQr, { recursive: true });
        }
        const cheminQr = path.join(dossierQr, `pharmacie_${id}.png`);

        // Convertir le dataURL en buffer et l'écrire
        const base64Data = qrDataUrl.replace(/^data:image\/png;base64,/, "");
        fs.writeFileSync(cheminQr, Buffer.from(base64Data, "base64"));

        await pool.query(
            `
            UPDATE pharmacies
            SET qr_code = ?
            WHERE id_pharmacie = ?
            `,
            [cheminQr, id]
        );

        res.status(201).json({
            message: "Pharmacie créée avec succès",
            id_pharmacie: id,
            qr_code: cheminQr,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
}

export async function recupererPharmacies(req, res) {
  try {
    const pharmacies = await getAllPharmacies();

    res.status(200).json(pharmacies);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des pharmacies",
      erreur: error.message,
    });
  }
}

export async function modifierUnePharmacie(req, res) {

    try {

        const result = await modifierPharmacie(
            req.params.id,
            req.body
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Pharmacie introuvable"
            });
        }

        res.json({
            message: "Pharmacie modifiée avec succès"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

}

export async function supprimerUnePharmacie(req, res) {

    try {

        const result = await supprimerPharmacie(req.params.id);

        if (result.affectedRows === 0) {

            return res.status(404).json({

                message: "Pharmacie introuvable"

            });

        }

        res.json({

            message: "Pharmacie supprimée avec succès"

        });

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

}

export async function ajouterUnePharmacie(req, res) {

    try {

        const logo = req.file
        ? req.file.path
        : null;

        const nouvellePharmacie = {

            nom_pharmacie: req.body.nom_pharmacie,

            logo: logo,

            telephone: req.body.telephone,

            email: req.body.email,

            adresse: req.body.adresse,

            ville: req.body.ville,

            pays: req.body.pays,

            horaires: req.body.horaires,

            quartier: req.body.quartier

        };

        const resultat = await creerPharmacieModel(nouvellePharmacie);

        const id = resultat.insertId;

        const qrDataUrl = await genererQRCode(`PHARMACIE_${id}`);

        // Sauvegarder le QR code en fichier
        const dossierQr = path.join(__dirname, "..", "Upload", "qrcodes");
        if (!fs.existsSync(dossierQr)) {
            fs.mkdirSync(dossierQr, { recursive: true });
        }
        const cheminQr = path.join(dossierQr, `pharmacie_${id}.png`);

        // Convertir le dataURL en buffer et l'écrire
        const base64Data = qrDataUrl.replace(/^data:image\/png;base64,/, "");
        fs.writeFileSync(cheminQr, Buffer.from(base64Data, "base64"));

        await pool.query(
            `
            UPDATE pharmacies
            SET qr_code = ?
            WHERE id_pharmacie = ?
            `,
            [cheminQr, id]
        );

        res.status(201).json({
            message: "Pharmacie créée avec succès",
            id_pharmacie: id,
            qr_code: cheminQr
        });

    } catch(error) {

        res.status(500).json({
            message: error.message
        });

    }

}