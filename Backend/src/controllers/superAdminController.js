import pool from "../config/database.js";

// Voir toutes les commandes
export async function voirToutesCommandes(req, res) {
    try {
        const [rows] = await pool.query(
            `
            SELECT c.*, u.nom, u.prenom, u.telephone, u.email, p.nom_pharmacie
            FROM commandes c
            JOIN utilisateurs u ON c.id_client = u.id_utilisateur
            LEFT JOIN pharmacies p ON c.id_pharmacie = p.id_pharmacie
            ORDER BY c.date_commande DESC
            `
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Voir tous les paiements
export async function voirTousPaiements(req, res) {
    try {
        const [rows] = await pool.query(
            `
            SELECT p.*, c.numero_commande, u.nom, u.prenom
            FROM paiements p
            JOIN commandes c ON p.id_commande = c.id_commande
            JOIN utilisateurs u ON c.id_client = u.id_utilisateur
            ORDER BY p.date_paiement DESC
            `
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Voir toutes les factures
export async function voirToutesFactures(req, res) {
    try {
        const [rows] = await pool.query(
            `
            SELECT f.*, c.numero_commande, u.nom, u.prenom, p.nom_pharmacie
            FROM factures f
            JOIN commandes c ON f.id_commande = c.id_commande
            JOIN utilisateurs u ON c.id_client = u.id_utilisateur
            LEFT JOIN pharmacies p ON c.id_pharmacie = p.id_pharmacie
            ORDER BY f.date_facture DESC
            `
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Voir toutes les livraisons
export async function voirToutesLivraisons(req, res) {
    try {
        const [rows] = await pool.query(
            `
            SELECT l.*, c.numero_commande, u.nom, u.prenom, lv.nom as nom_livreur, lv.prenom as prenom_livreur
            FROM livraisons l
            JOIN commandes c ON l.id_commande = c.id_commande
            JOIN utilisateurs u ON c.id_client = u.id_utilisateur
            LEFT JOIN livreurs lv ON l.id_livreur = lv.id_livreur
            ORDER BY l.date_creation DESC
            `
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Consulter le journal d'activité
export async function voirJournalActivite(req, res) {
    try {
        const [rows] = await pool.query(
            `
            SELECT j.*, u.nom, u.prenom, u.email
            FROM journal_activite j
            LEFT JOIN utilisateurs u ON j.id_utilisateur = u.id_utilisateur
            ORDER BY j.date_action DESC
            LIMIT 500
            `
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Désactiver / activer une pharmacie
export async function changerStatutPharmacie(req, res) {
    try {
        const { id } = req.params;
        const { est_actif } = req.body;

        const [result] = await pool.query(
            `
            UPDATE pharmacies
            SET est_actif = ?
            WHERE id_pharmacie = ?
            `,
            [est_actif, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Pharmacie introuvable" });
        }

        res.json({
            message: est_actif ? "Pharmacie activée" : "Pharmacie désactivée"
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}