import pool from "../config/database.js";

export async function creerLaboratoire(data) {
    const { nom_laboratoire, adresse, telephone, email } = data;

    const [result] = await pool.query(
        `
        INSERT INTO laboratoires
        (nom_laboratoire, adresse, telephone, email)
        VALUES (?, ?, ?, ?)
        `,
        [nom_laboratoire, adresse, telephone, email]
    );

    return result;
}

export async function getLaboratoires() {
    const [rows] = await pool.query(
        `
        SELECT * FROM laboratoires
        WHERE est_supprime = 0
        ORDER BY nom_laboratoire
        `
    );
    return rows;
}

export async function trouverLaboratoire(id) {
    const [rows] = await pool.query(
        `
        SELECT * FROM laboratoires
        WHERE id_laboratoire = ?
        `,
        [id]
    );
    return rows[0];
}

export async function modifierLaboratoire(id, data) {
    const { nom_laboratoire, adresse, telephone, email } = data;

    const [result] = await pool.query(
        `
        UPDATE laboratoires
        SET nom_laboratoire = ?, adresse = ?, telephone = ?, email = ?
        WHERE id_laboratoire = ?
        `,
        [nom_laboratoire, adresse, telephone, email, id]
    );

    return result;
}

export async function supprimerLaboratoire(id) {
    const [result] = await pool.query(
        `
        UPDATE laboratoires
        SET est_supprime = 1
        WHERE id_laboratoire = ?
        `,
        [id]
    );
    return result;
}