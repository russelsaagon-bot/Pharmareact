import pool from "../config/database.js";


export async function creerPaiement(
    connection,
    data
){

    const {

        id_commande,
        montant,
        methode,
        reference_transaction

    } = data;



    const [result] = await connection.query(

        `
        INSERT INTO paiements

        (
            id_commande,
            montant,
            methode,
            reference_transaction,
            statut
        )

        VALUES (?,?,?,?,?)

        `,

        [

            id_commande,

            montant,

            methode,

            reference_transaction,

            "en_attente"

        ]

    );



    return result;

}

export async function trouverPaiementParCommande(
    connection,
    id_commande
){


    const [rows] = await connection.query(

        `
        SELECT *

        FROM paiements

        WHERE id_commande = ?

        `,

        [

            id_commande

        ]

    );


    return rows[0];

}

export async function modifierStatutPaiement(
    connection,
    id_paiement,
    statut,
    reference_transaction
){


    const [result] = await connection.query(

        `
        UPDATE paiements

        SET

        statut = ?,

        reference_transaction = ?

        WHERE id_paiement = ?

        `,

        [

            statut,

            reference_transaction,

            id_paiement

        ]

    );


    return result;

}

export async function trouverPaiementParId(
    connection,
    id_paiement
){

    const [rows] = await connection.query(

        `
        SELECT *

        FROM paiements

        WHERE id_paiement = ?

        `,

        [
            id_paiement
        ]

    );


    return rows[0];

}

