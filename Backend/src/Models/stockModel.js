import pool from "../config/database.js";

export async function creerStock(data) {

    const {
        id_pharmacie,
        id_medicament,
        qr_code
    } = data;

    const [result] = await pool.query(

        `
        INSERT INTO stocks
        (
            id_pharmacie,
            id_medicament,
            quantite,
            seuil_alerte,
            qr_code
        )

        VALUES (?,?,?,?,?)
        `,

        [
            id_pharmacie,
            id_medicament,
            0,
            10,
            qr_code
        ]

    );

    return result;
}


export async function trouverStock(connection, id_pharmacie, id_medicament) {


    const [rows] = await connection.query(

        `
        SELECT *
        FROM stocks
        WHERE id_pharmacie = ?
        AND id_medicament = ?

        `,

        [

            id_pharmacie,
            id_medicament

        ]

    );


    return rows[0];

}




// Augmenter la quantité du stock







// Récupérer la quantité actuelle

export async function obtenirQuantiteStock(connection, id_stock) {


    const [rows] = await connection.query(

        `
        SELECT quantite
        FROM stocks
        WHERE id_stock = ?

        `,

        [

            id_stock

        ]

    );


    return rows[0].quantite;

}


export async function diminuerStock(connection, id_stock, quantite){

    const [result] = await connection.query(

        `
        UPDATE stocks

        SET 
        quantite = quantite - ?,
        date_mise_a_jour = CURRENT_TIMESTAMP

        WHERE id_stock = ?

        AND quantite >= ?

        `,

        [
            quantite,
            id_stock,
            quantite
        ]

    );


    return result;

}

export async function augmenterStock(
    connection,
    id_stock,
    quantite
){

    const [result] = await connection.query(

        `
        UPDATE stocks

        SET 
        quantite = quantite + ?,
        date_mise_a_jour = CURRENT_TIMESTAMP

        WHERE id_stock = ?

        `,

        [

            quantite,

            id_stock

        ]

    );


    return result;

}