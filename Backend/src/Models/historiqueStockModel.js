import pool from "../config/database.js";

export async function ajouterHistorique(connection, data) {


    const {

        id_stock,
        id_utilisateur,
        ancienne_quantite,
        nouvelle_quantite,
        type_operation

    } = data;



    const [result] = await connection.query(

        `
        INSERT INTO historique_stock
        (
            id_stock,
            id_utilisateur,
            ancienne_quantite,
            nouvelle_quantite,
            type_operation
        )

        VALUES (?,?,?,?,?)

        `,

        [

            id_stock,
            id_utilisateur,
            ancienne_quantite,
            nouvelle_quantite,
            type_operation

        ]

    );


    return result;

}
