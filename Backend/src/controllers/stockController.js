import pool from "../config/database.js";
import { genererQRCode } from "../utils/generateQr.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Voir le stock d'une pharmacie
export async function voirStock(req, res) {
    try {
        const id_pharmacie = req.utilisateur.id_pharmacie;

        const [rows] = await pool.query(
            `
            SELECT s.*, m.nom_medicament, m.prix, m.image, m.date_expiration, m.numero_lot
            FROM stocks s
            JOIN medicaments m ON s.id_medicament = m.id_medicament
            WHERE s.id_pharmacie = ? AND m.est_supprime = 0
            ORDER BY m.nom_medicament
            `,
            [id_pharmacie]
        );

        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Voir les alertes de stock faible
export async function voirAlertesStock(req, res) {
    try {
        const id_pharmacie = req.utilisateur.id_pharmacie;

        const [rows] = await pool.query(
            `
            SELECT s.*, m.nom_medicament, m.prix
            FROM stocks s
            JOIN medicaments m ON s.id_medicament = m.id_medicament
            WHERE s.id_pharmacie = ? 
            AND s.quantite <= s.seuil_alerte
            AND m.est_supprime = 0
            ORDER BY s.quantite ASC
            `,
            [id_pharmacie]
        );

        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Voir l'historique des mouvements de stock
export async function voirMouvementsStock(req, res) {
    try {
        const id_pharmacie = req.utilisateur.id_pharmacie;

        const [rows] = await pool.query(
            `
            SELECT ms.*, m.nom_medicament, u.nom, u.prenom
            FROM mouvements_stock ms
            JOIN stocks s ON ms.id_stock = s.id_stock
            JOIN medicaments m ON s.id_medicament = m.id_medicament
            LEFT JOIN utilisateurs u ON ms.id_utilisateur = u.id_utilisateur
            WHERE s.id_pharmacie = ?
            ORDER BY ms.date_mouvement DESC
            LIMIT 500
            `,
            [id_pharmacie]
        );

        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Voir l'historique des modifications de stock
export async function voirHistoriqueStock(req, res) {
    try {
        const id_pharmacie = req.utilisateur.id_pharmacie;

        const [rows] = await pool.query(
            `
            SELECT hs.*, m.nom_medicament, u.nom, u.prenom
            FROM historique_stock hs
            JOIN stocks s ON hs.id_stock = s.id_stock
            JOIN medicaments m ON s.id_medicament = m.id_medicament
            LEFT JOIN utilisateurs u ON hs.id_utilisateur = u.id_utilisateur
            WHERE s.id_pharmacie = ?
            ORDER BY hs.date_modification DESC
            LIMIT 500
            `,
            [id_pharmacie]
        );

        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Générer le QR code d'un stock
export async function genererQrStock(req, res) {
    try {
        const { id } = req.params;

        const [rows] = await pool.query(
            `
            SELECT s.*, m.nom_medicament
            FROM stocks s
            JOIN medicaments m ON s.id_medicament = m.id_medicament
            WHERE s.id_stock = ?
            `,
            [id]
        );

        const stock = rows[0];

        if (!stock) {
            return res.status(404).json({ message: "Stock introuvable" });
        }

        const qrDataUrl = await genererQRCode({
            id_stock: stock.id_stock,
            medicament: stock.nom_medicament,
            pharmacie: stock.id_pharmacie,
            date: Date.now()
        });

        // Sauvegarder le QR code en fichier
        const dossierQr = path.join(__dirname, "..", "Upload", "qrcodes");
        if (!fs.existsSync(dossierQr)) {
            fs.mkdirSync(dossierQr, { recursive: true });
        }
        const cheminQr = path.join(dossierQr, `stock_${stock.id_stock}.png`);

        const base64Data = qrDataUrl.replace(/^data:image\/png;base64,/, "");
        fs.writeFileSync(cheminQr, Buffer.from(base64Data, "base64"));

        await pool.query(
            `
            UPDATE stocks
            SET qr_code = ?
            WHERE id_stock = ?
            `,
            [cheminQr, stock.id_stock]
        );

        res.json({
            message: "QR code généré avec succès",
            qr_code: cheminQr
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Modifier la quantité d'un stock
export async function modifierQuantiteStock(req, res) {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const { id } = req.params;
        const { quantite, type_operation } = req.body;
        const id_utilisateur = req.utilisateur.id_utilisateur;

        const [rows] = await connection.query(
            `
            SELECT * FROM stocks WHERE id_stock = ?
            `,
            [id]
        );

        const stock = rows[0];

        if (!stock) {
            throw new Error("Stock introuvable");
        }

        const ancienne_quantite = stock.quantite;
        let nouvelle_quantite;

        if (type_operation === "ajout") {
            nouvelle_quantite = ancienne_quantite + quantite;
        } else if (type_operation === "retrait") {
            if (quantite > ancienne_quantite) {
                throw new Error("Quantité insuffisante en stock");
            }
            nouvelle_quantite = ancienne_quantite - quantite;
        } else {
            nouvelle_quantite = quantite;
        }

        await connection.query(
            `
            UPDATE stocks
            SET quantite = ?, date_mise_a_jour = CURRENT_TIMESTAMP
            WHERE id_stock = ?
            `,
            [nouvelle_quantite, id]
        );

        await connection.query(
            `
            INSERT INTO mouvements_stock (id_stock, type_mouvement, quantite, commentaire, id_utilisateur)
            VALUES (?, ?, ?, ?, ?)
            `,
            [id, type_operation === "retrait" ? "sortie" : "entree", quantite, "Modification manuelle", id_utilisateur]
        );

        await connection.query(
            `
            INSERT INTO historique_stock (id_stock, id_utilisateur, ancienne_quantite, nouvelle_quantite, type_operation)
            VALUES (?, ?, ?, ?, ?)
            `,
            [id, id_utilisateur, ancienne_quantite, nouvelle_quantite, "modification"]
        );

        await connection.commit();

        res.json({
            message: "Stock modifié avec succès",
            ancienne_quantite,
            nouvelle_quantite
        });
    } catch (error) {
        await connection.rollback();
        res.status(400).json({ message: error.message });
    } finally {
        connection.release();
    }
}