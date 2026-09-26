import pool from "../config/database.js";

export async function getStatistiquesGlobales() {
    const [commandes] = await pool.query(
        `SELECT COUNT(*) as total FROM commandes`
    );
    const [commandesEnAttente] = await pool.query(
        `SELECT COUNT(*) as total FROM commandes WHERE statut = 'en_attente'`
    );
    const [commandesLivrees] = await pool.query(
        `SELECT COUNT(*) as total FROM commandes WHERE statut = 'livree'`
    );
    const [paiements] = await pool.query(
        `SELECT COUNT(*) as total FROM paiements WHERE statut = 'reussi'`
    );
    const [revenus] = await pool.query(
        `SELECT COALESCE(SUM(montant), 0) as total FROM paiements WHERE statut = 'reussi'`
    );
    const [medicaments] = await pool.query(
        `SELECT COUNT(*) as total FROM medicaments WHERE est_supprime = 0`
    );
    const [pharmacies] = await pool.query(
        `SELECT COUNT(*) as total FROM pharmacies`
    );
    const [utilisateurs] = await pool.query(
        `SELECT COUNT(*) as total FROM utilisateurs WHERE est_supprime = 0`
    );
    const [livreurs] = await pool.query(
        `SELECT COUNT(*) as total FROM livreurs WHERE est_supprime = 0`
    );
    const [stocksFaibles] = await pool.query(
        `SELECT COUNT(*) as total FROM stocks WHERE quantite <= seuil_alerte`
    );

    return {
        commandes: commandes[0].total,
        commandesEnAttente: commandesEnAttente[0].total,
        commandesLivrees: commandesLivrees[0].total,
        paiementsReussis: paiements[0].total,
        revenusTotal: revenus[0].total,
        medicaments: medicaments[0].total,
        pharmacies: pharmacies[0].total,
        utilisateurs: utilisateurs[0].total,
        livreurs: livreurs[0].total,
        stocksFaibles: stocksFaibles[0].total
    };
}

export async function getStatistiquesPharmacie(id_pharmacie) {
    const [commandes] = await pool.query(
        `SELECT COUNT(*) as total FROM commandes WHERE id_pharmacie = ?`,
        [id_pharmacie]
    );
    const [commandesEnAttente] = await pool.query(
        `SELECT COUNT(*) as total FROM commandes WHERE id_pharmacie = ? AND statut = 'en_attente'`,
        [id_pharmacie]
    );
    const [commandesLivrees] = await pool.query(
        `SELECT COUNT(*) as total FROM commandes WHERE id_pharmacie = ? AND statut = 'livree'`,
        [id_pharmacie]
    );
    const [revenus] = await pool.query(
        `SELECT COALESCE(SUM(p.montant), 0) as total 
         FROM paiements p
         JOIN commandes c ON p.id_commande = c.id_commande
         WHERE c.id_pharmacie = ? AND p.statut = 'reussi'`,
        [id_pharmacie]
    );
    const [medicaments] = await pool.query(
        `SELECT COUNT(*) as total FROM medicaments WHERE id_pharmacie = ? AND est_supprime = 0`,
        [id_pharmacie]
    );
    const [stocksFaibles] = await pool.query(
        `SELECT COUNT(*) as total FROM stocks WHERE id_pharmacie = ? AND quantite <= seuil_alerte`,
        [id_pharmacie]
    );
    const [livreurs] = await pool.query(
        `SELECT COUNT(*) as total FROM livreurs WHERE id_pharmacie = ? AND est_supprime = 0`,
        [id_pharmacie]
    );

    return {
        commandes: commandes[0].total,
        commandesEnAttente: commandesEnAttente[0].total,
        commandesLivrees: commandesLivrees[0].total,
        revenusTotal: revenus[0].total,
        medicaments: medicaments[0].total,
        stocksFaibles: stocksFaibles[0].total,
        livreurs: livreurs[0].total
    };
}

export async function getVentesParJour(id_pharmacie, jours = 7) {
    const [rows] = await pool.query(
        `
        SELECT DATE(c.date_commande) as date, COUNT(*) as total_commandes, 
               COALESCE(SUM(p.montant), 0) as revenus
        FROM commandes c
        LEFT JOIN paiements p ON c.id_commande = p.id_commande AND p.statut = 'reussi'
        WHERE c.id_pharmacie = ?
        AND c.date_commande >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
        GROUP BY DATE(c.date_commande)
        ORDER BY date DESC
        `,
        [id_pharmacie, jours]
    );
    return rows;
}

export async function getMedicamentsPopulaires(id_pharmacie, limite = 5) {
    const [rows] = await pool.query(
        `
        SELECT m.nom_medicament, SUM(lc.quantite) as total_vendu
        FROM lignes_commandes lc
        JOIN medicaments m ON lc.id_medicament = m.id_medicament
        JOIN commandes c ON lc.id_commande = c.id_commande
        WHERE c.id_pharmacie = ?
        GROUP BY m.nom_medicament
        ORDER BY total_vendu DESC
        LIMIT ?
        `,
        [id_pharmacie, limite]
    );
    return rows;
}