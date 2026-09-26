import pool from "../config/database.js";

export async function creerApprovisionnement(connection, data) {

    const {
        id_fournisseur,
        id_pharmacie,
        id_medicament,
        quantite,
        prix_achat
    } = data;

    const [result] = await connection.query(
        `
        INSERT INTO approvisionnements
        (
            id_fournisseur,
            id_pharmacie,
            id_medicament,
            quantite,
            prix_achat
        )
        VALUES (?,?,?,?,?)
        `,
        [
            id_fournisseur,
            id_pharmacie,
            id_medicament,
            quantite,
            prix_achat
        ]
    );

    return result;
}

export async function getApprovisionnementsParPharmacie(id_pharmacie) {

    const [rows] = await pool.query(
        `
        SELECT 
            a.*,
            f.nom_fournisseur,
            m.nom_medicament

        FROM approvisionnements a

        LEFT JOIN fournisseurs f
        ON a.id_fournisseur = f.id_fournisseur

        LEFT JOIN medicaments m
        ON a.id_medicament = m.id_medicament

        WHERE a.id_pharmacie = ?

        ORDER BY a.date_approvisionnement DESC
        `,
        [
            id_pharmacie
        ]
    );

    return rows;
}

export async function trouverApprovisionnement(id) {

    const [rows] = await pool.query(
        `
        SELECT 
            a.*,
            f.nom_fournisseur,
            m.nom_medicament

        FROM approvisionnements a

        LEFT JOIN fournisseurs f
        ON a.id_fournisseur = f.id_fournisseur

        LEFT JOIN medicaments m
        ON a.id_medicament = m.id_medicament

        WHERE a.id_approvisionnement = ?
        `,
        [
            id
        ]
    );

    return rows[0];
}