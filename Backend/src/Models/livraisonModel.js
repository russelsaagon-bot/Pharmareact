import pool from "../config/database.js";



export async function creerLivraison(
    connection,
    data
){

    const {

        id_commande,
        nom_destinataire,
        telephone,
        adresse,
        ville,
        quartier,
        instructions

    } = data;



    const [result] = await connection.query(

        `
        INSERT INTO livraisons

        (
            id_commande,
            nom_destinataire,
            telephone,
            adresse,
            ville,
            quartier,
            instructions,
            statut
        )

        VALUES (?,?,?,?,?,?,?,?)

        `,

        [

            id_commande,

            nom_destinataire,

            telephone,

            adresse,

            ville,

            quartier,

            instructions,

            "en_attente"

        ]

    );


    return result;

}



export async function trouverLivraisonParCommande(
    connection,
    id_commande
){

    const [rows] = await connection.query(

        `
        SELECT *

        FROM livraisons

        WHERE id_commande = ?

        `,

        [

            id_commande

        ]

    );


    return rows[0];

}

export async function modifierStatutLivraison(
    connection,
    id_livraison,
    statut
){

    const [result] = await connection.query(

        `
        UPDATE livraisons

        SET statut = ?

        WHERE id_livraison = ?

        `,

        [

            statut,

            id_livraison

        ]

    );


    return result;

}


export async function affecterLivreur(
    connection,
    id_livraison,
    id_livreur
){

    const [result] = await connection.query(

        `
        UPDATE livraisons

        SET id_livreur = ?

        WHERE id_livraison = ?

        `,

        [

            id_livreur,

            id_livraison

        ]

    );


    return result;

}

export async function trouverLivraisonParId(
    connection,
    id_livraison
){

    const [rows] = await connection.query(

        `
        SELECT *

        FROM livraisons

        WHERE id_livraison = ?

        `,

        [

            id_livraison

        ]

    );


    return rows[0];

}

export async function listerLivraisonsParLivreur(id_utilisateur) {
    const [rows] = await pool.query(
        `
        SELECT 
            l.*,
            c.numero_commande,
            c.montant_total,
            c.statut AS statut_commande,
            u.nom AS client_nom,
            u.prenom AS client_prenom,
            u.telephone AS client_telephone,
            p.nom_pharmacie
        FROM livraisons l
        INNER JOIN livreurs lv ON l.id_livreur = lv.id_livreur
        INNER JOIN commandes c ON l.id_commande = c.id_commande
        INNER JOIN utilisateurs u ON c.id_client = u.id_utilisateur
        INNER JOIN pharmacies p ON c.id_pharmacie = p.id_pharmacie
        WHERE lv.id_utilisateur = ?
        ORDER BY l.id_livraison DESC
        `,
        [id_utilisateur]
    );
    return rows;
}
