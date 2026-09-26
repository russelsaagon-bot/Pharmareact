import pool from "../config/database.js";

export async function creerCategorie(data) {
    const { nom_categorie, description } = data;

    const [result] = await pool.query(
        `
        INSERT INTO categories
        (nom_categorie, description)
        VALUES (?, ?)
        `,
        [nom_categorie, description]
    );

    return result;
}

export async function getCategories() {
    const [rows] = await pool.query(
        `
        SELECT * FROM categories
        ORDER BY nom_categorie
        `
    );
    return rows;
}

export async function trouverCategorie(id) {
    const [rows] = await pool.query(
        `
        SELECT * FROM categories
        WHERE id_categorie = ?
        `,
        [id]
    );
    return rows[0];
}

export async function modifierCategorie(id, data) {
    const { nom_categorie, description } = data;

    const [result] = await pool.query(
        `
        UPDATE categories
        SET nom_categorie = ?, description = ?
        WHERE id_categorie = ?
        `,
        [nom_categorie, description, id]
    );

    return result;
}

export async function supprimerCategorie(id) {
    const [result] = await pool.query(
        `
        UPDATE categories
        SET est_supprime = 1
        WHERE id_categorie = ?
        `,
        [id]
    );
    return result;
}