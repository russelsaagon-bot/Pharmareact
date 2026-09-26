import pool from "../config/database.js";

export async function creerPanier(data) {
    const { id_utilisateur } = data;

    const [result] = await pool.query(
        `
        INSERT INTO paniers (id_utilisateur)
        VALUES (?)
        `,
        [id_utilisateur]
    );

    return result;
}

export async function trouverPanierUtilisateur(id_utilisateur) {
    const [rows] = await pool.query(
        `
        SELECT * FROM paniers
        WHERE id_utilisateur = ?
        `,
        [id_utilisateur]
    );
    return rows[0];
}

export async function ajouterArticlePanier(data) {
    const { id_panier, id_medicament, quantite } = data;

    const [result] = await pool.query(
        `
        INSERT INTO panier_articles (id_panier, id_medicament, quantite)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE quantite = quantite + ?
        `,
        [id_panier, id_medicament, quantite, quantite]
    );

    return result;
}

export async function getArticlesPanier(id_panier) {
    const [rows] = await pool.query(
        `
        SELECT pa.*, m.nom_medicament, m.prix, m.image, m.description
        FROM panier_articles pa
        JOIN medicaments m ON pa.id_medicament = m.id_medicament
        WHERE pa.id_panier = ?
        `,
        [id_panier]
    );
    return rows;
}

export async function modifierQuantiteArticle(id_panier, id_medicament, quantite) {
    const [result] = await pool.query(
        `
        UPDATE panier_articles
        SET quantite = ?
        WHERE id_panier = ? AND id_medicament = ?
        `,
        [quantite, id_panier, id_medicament]
    );

    return result;
}

export async function supprimerArticlePanier(id_panier, id_medicament) {
    const [result] = await pool.query(
        `
        DELETE FROM panier_articles
        WHERE id_panier = ? AND id_medicament = ?
        `,
        [id_panier, id_medicament]
    );

    return result;
}

export async function viderPanier(id_panier) {
    const [result] = await pool.query(
        `
        DELETE FROM panier_articles
        WHERE id_panier = ?
        `,
        [id_panier]
    );

    return result;
}