import pool from "../config/database.js";

export async function tableauDeBordPharmacie(req, res) {
    try {
        const id_pharmacie = req.utilisateur.id_pharmacie;

        // Nombre de médicaments
        const [medicaments] = await pool.query(
            `SELECT COUNT(*) as total FROM medicaments WHERE id_pharmacie = ? AND est_supprime = 0`,
            [id_pharmacie]
        );

        // Stock disponible
        const [stock] = await pool.query(
            `SELECT COALESCE(SUM(quantite), 0) as total FROM stocks WHERE id_pharmacie = ?`,
            [id_pharmacie]
        );

        // Commandes du jour
        const [commandesJour] = await pool.query(
            `SELECT COUNT(*) as total FROM commandes WHERE id_pharmacie = ? AND DATE(date_commande) = CURDATE()`,
            [id_pharmacie]
        );

        // Chiffre d'affaires
        const [chiffreAffaires] = await pool.query(
            `SELECT COALESCE(SUM(p.montant), 0) as total 
             FROM paiements p
             JOIN commandes c ON p.id_commande = c.id_commande
             WHERE c.id_pharmacie = ? AND p.statut = 'reussi'`,
            [id_pharmacie]
        );

        // Alertes de stock faible
        const [alertesStock] = await pool.query(
            `SELECT COUNT(*) as total FROM stocks WHERE id_pharmacie = ? AND quantite <= seuil_alerte`,
            [id_pharmacie]
        );

        // Commandes en attente
        const [commandesEnAttente] = await pool.query(
            `SELECT COUNT(*) as total FROM commandes WHERE id_pharmacie = ? AND statut = 'en_attente'`,
            [id_pharmacie]
        );

        // Commandes en préparation
        const [commandesEnPreparation] = await pool.query(
            `SELECT COUNT(*) as total FROM commandes WHERE id_pharmacie = ? AND statut = 'en_preparation'`,
            [id_pharmacie]
        );

        // Livraisons en cours
        const [livraisonsEnCours] = await pool.query(
            `SELECT COUNT(*) as total 
             FROM livraisons l
             JOIN commandes c ON l.id_commande = c.id_commande
             WHERE c.id_pharmacie = ? AND l.statut IN ('en_attente', 'en_preparation', 'en_route')`,
            [id_pharmacie]
        );

        // Livreurs disponibles
        const [livreursDisponibles] = await pool.query(
            `SELECT COUNT(*) as total FROM livreurs WHERE id_pharmacie = ? AND statut = 'disponible' AND est_supprime = 0`,
            [id_pharmacie]
        );

        res.json({
            medicaments: medicaments[0].total,
            stockDisponible: stock[0].total,
            commandesDuJour: commandesJour[0].total,
            chiffreAffaires: chiffreAffaires[0].total,
            alertesStockFaible: alertesStock[0].total,
            commandesEnAttente: commandesEnAttente[0].total,
            commandesEnPreparation: commandesEnPreparation[0].total,
            livraisonsEnCours: livraisonsEnCours[0].total,
            livreursDisponibles: livreursDisponibles[0].total
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function voirDisponibiliteLivreurs(req, res) {
    try {
        const id_pharmacie = req.utilisateur.id_pharmacie;

        const [rows] = await pool.query(
            `
            SELECT id_livreur, nom, prenom, telephone, statut
            FROM livreurs
            WHERE id_pharmacie = ? AND est_supprime = 0
            ORDER BY statut, nom
            `,
            [id_pharmacie]
        );

        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}