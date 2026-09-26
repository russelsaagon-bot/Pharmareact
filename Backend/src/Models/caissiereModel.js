import pool from "../config/database.js";

export async function creerCaissiere(data) {
    const { nom, prenom, telephone, email, id_utilisateur, id_pharmacie } = data;

    const [result] = await pool.query(
        `
        INSERT INTO caissieres
        (nom, prenom, telephone, email, id_utilisateur, id_pharmacie, statut)
        VALUES (?, ?, ?, ?, ?, ?, 'active')
        `,
        [nom, prenom, telephone, email, id_utilisateur, id_pharmacie]
    );

    return result;
}

export async function getCaissieres() {
    const [rows] = await pool.query(
        `
        SELECT c.*, p.nom_pharmacie
        FROM caissieres c
        LEFT JOIN pharmacies p ON c.id_pharmacie = p.id_pharmacie
        ORDER BY c.nom
        `
    );
    return rows;
}

export async function getCaissieresParPharmacie(id_pharmacie) {
    const [rows] = await pool.query(
        `
        SELECT * FROM caissieres
        WHERE id_pharmacie = ?
        ORDER BY nom
        `,
        [id_pharmacie]
    );
    return rows;
}

export async function trouverCaissiere(id) {
    const [rows] = await pool.query(
        `
        SELECT * FROM caissieres
        WHERE id_caissiere = ?
        `,
        [id]
    );
    return rows[0];
}

export async function trouverCaissiereParUtilisateur(id_utilisateur) {
    const [rows] = await pool.query(
        `
        SELECT * FROM caissieres
        WHERE id_utilisateur = ?
        `,
        [id_utilisateur]
    );
    return rows[0];
}

export async function modifierCaissiere(id, data) {
    const { nom, prenom, telephone, email, statut } = data;

    const [result] = await pool.query(
        `
        UPDATE caissieres
        SET nom = ?, prenom = ?, telephone = ?, email = ?, statut = ?
        WHERE id_caissiere = ?
        `,
        [nom, prenom, telephone, email, statut || 'active', id]
    );

    return result;
}

export async function supprimerCaissiere(id) {
    const [result] = await pool.query(
        `
        DELETE FROM caissieres
        WHERE id_caissiere = ?
        `,
        [id]
    );
    return result;
}