import pool from "../config/database.js";



export async function creerFacture(
    connection,
    data
){

    const {

        id_commande,
        numero_facture,
        qr_code,
        montant

    } = data;



    const [result] = await connection.query(

        `
        INSERT INTO factures

        (
            id_commande,
            numero_facture,
            qr_code,
            montant
        )

        VALUES (?,?,?,?)

        `,

        [

            id_commande,

            numero_facture,

            qr_code,

            montant

        ]

    );


    return result;

}

export async function trouverFactureParCommande(
    connection,
    id_commande
){

    const [rows] = await connection.query(

        `
        SELECT *

        FROM factures

        WHERE id_commande = ?

        `,

        [

            id_commande

        ]

    );


    return rows[0];

}

export async function trouverFactureParId(
    connection,
    id_facture
){

    const [rows] = await connection.query(

        `
        SELECT *

        FROM factures

        WHERE id_facture = ?

        `,

        [

            id_facture

        ]

    );


    return rows[0];

}

export async function trouverFactureComplete(
    connection,
    id_facture
){

    const [rows] = await connection.query(

        `
        SELECT

        f.id_facture,
        f.numero_facture,
        f.qr_code,
        f.montant,
        f.date_facture,

        c.id_commande,
        c.numero_commande,
        c.statut,
        c.mode_reception,

        u.id_utilisateur AS id_client,
        u.nom,
        u.prenom,
        u.telephone,
        u.email


        FROM factures f


        INNER JOIN commandes c

        ON f.id_commande = c.id_commande


        INNER JOIN utilisateurs u

        ON c.id_client = u.id_utilisateur


        WHERE f.id_facture = ?

        `,

        [

            id_facture

        ]

    );


    return rows[0];

}