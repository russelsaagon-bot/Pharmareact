import pool from "../config/database.js";

export async function creerNotification(data, connection) {
    const {
        id_utilisateur,
        titre,
        message,
        id_commande,
        id_paiement,
        id_livraison
    } = data;

    const db = connection || pool;

    const [result] = await db.query(
        `
        INSERT INTO notifications
        (
            id_utilisateur,
            titre,
            message,
            est_lue
        )
        VALUES (?, ?, ?, 0)
        `,
        [id_utilisateur, titre || "Notification", message]
    );

    return result;
}

export async function getNotificationsUtilisateur(id_utilisateur) {
    const [rows] = await pool.query(
        `
        SELECT * FROM notifications
        WHERE id_utilisateur = ?
        ORDER BY date_creation DESC
        `,
        [id_utilisateur]
    );
    return rows;
}

export async function getNotificationsNonLues(id_utilisateur) {
    const [rows] = await pool.query(
        `
        SELECT * FROM notifications
        WHERE id_utilisateur = ? AND est_lue = 0
        ORDER BY date_creation DESC
        `,
        [id_utilisateur]
    );
    return rows;
}

export async function marquerNotificationLue(id_notification) {
    const [result] = await pool.query(
        `
        UPDATE notifications
        SET est_lue = 1
        WHERE id_notification = ?
        `,
        [id_notification]
    );
    return result;
}

export async function marquerToutesNotificationsLues(id_utilisateur) {
    const [result] = await pool.query(
        `
        UPDATE notifications
        SET est_lue = 1
        WHERE id_utilisateur = ?
        `,
        [id_utilisateur]
    );
    return result;
}

export async function getNotificationsPharmacie(id_pharmacie) {
    const [rows] = await pool.query(
        `
        SELECT n.*, u.nom, u.prenom
        FROM notifications n
        JOIN utilisateurs u ON n.id_utilisateur = u.id_utilisateur
        WHERE u.id_pharmacie = ?
        ORDER BY n.date_creation DESC
        `,
        [id_pharmacie]
    );
    return rows;
}