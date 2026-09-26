import pool from "../config/database.js";

export async function creerFournisseur(data) {
    const { nom_fournisseur, telephone, email, adresse } = data;

    const [result] = await pool.query(
        `
        INSERT INTO fournisseurs
        (nom_fournisseur, telephone, email, adresse)
        VALUES (?, ?, ?, ?)
        `,
        [nom_fournisseur, telephone, email, adresse]
    );

    return result;
}

export async function getFournisseurs() {
    const [rows] = await pool.query(
        `
        SELECT * FROM fournisseurs
        WHERE est_supprime = 0
        ORDER BY nom_fournisseur
        `
    );
    return rows;
}

export async function trouverFournisseur(id) {
    const [rows] = await pool.query(
        `
        SELECT * FROM fournisseurs
        WHERE id_fournisseur = ?
        `,
        [id]
    );
    return rows[0];
}

export async function modifierFournisseur(id, data) {
    const { nom_fournisseur, telephone, email, adresse } = data;

    const [result] = await pool.query(
        `
        UPDATE fournisseurs
        SET nom_fournisseur = ?, telephone = ?, email = ?, adresse = ?
        WHERE id_fournisseur = ?
        `,
        [nom_fournisseur, telephone, email, adresse, id]
    );

    return result;
}

export async function supprimerFournisseur(id) {
    const [result] = await pool.query(
        `
        UPDATE fournisseurs
        SET est_supprime = 1
        WHERE id_fournisseur = ?
        `,
        [id]
    );
    return result;
}