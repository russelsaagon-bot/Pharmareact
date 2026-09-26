export async function creerCommande(connection, data) {

    const {

        numero_commande,
        id_client,
        id_pharmacie,
        mode_reception,
        montant_total,
        ordonnance_url

    } = data;

    const [result] = await connection.query(

        `
        INSERT INTO commandes
        (
            numero_commande,
            id_client,
            id_pharmacie,
            mode_reception,
            montant_total,
            statut,
            ordonnance_url
        )

        VALUES (?,?,?,?,?,?,?)

        `,

        [

            numero_commande,
            id_client,
            id_pharmacie,
            mode_reception,
            montant_total,
            "en_attente",
            ordonnance_url || null

        ]

    );

    return result;

}




export async function trouverCommandeParId(connection, id_commande) {

    const [rows] = await connection.query(

        `
        SELECT *
        FROM commandes
        WHERE id_commande = ?
        `,

        [id_commande]

    );

    return rows[0];

}



export async function trouverCommandeParNumero(connection, numero_commande) {

    const [rows] = await connection.query(

        `
        SELECT *
        FROM commandes
        WHERE numero_commande = ?
        `,

        [numero_commande]

    );

    return rows[0];

}



export async function changerStatutCommande(
    connection,
    id_commande,
    statut
) {

    const [result] = await connection.query(

        `
        UPDATE commandes

        SET statut = ?

        WHERE id_commande = ?
        `,

        [

            statut,
            id_commande

        ]

    );

    return result;

}
 
export async function listerCommandesParClient(
    connection,
    id_client
) {

    const [rows] = await connection.query(

        `
        SELECT *

        FROM commandes

        WHERE id_client = ?

        ORDER BY date_commande DESC
        `,

        [

            id_client

        ]

    );

    return rows;

}


export async function listerCommandesParPharmacie(
    connection,
    id_pharmacie
){

    const [rows] = await connection.query(

        `
        SELECT 
            c.*,
            u.nom,
            u.prenom,
            u.telephone,
            u.email

        FROM commandes c

        INNER JOIN utilisateurs u

        ON c.id_client = u.id_utilisateur

        WHERE c.id_pharmacie = ?

        ORDER BY c.date_commande DESC

        `,

        [
            id_pharmacie
        ]

    );


    return rows;

}
 

export async function modifierStatutCommande(
    connection,
    id_commande,
    statut
){

    const [result] = await connection.query(

        `
        UPDATE commandes

        SET statut = ?

        WHERE id_commande = ?

        `,

        [

            statut,

            id_commande

        ]

    );


    return result;

}