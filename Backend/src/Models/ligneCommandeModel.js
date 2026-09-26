export async function ajouterLigneCommande(connection, data) {

    const {

        id_commande,
        id_medicament,
        quantite,
        prix_unitaire

    } = data;

    const sous_total = quantite * prix_unitaire;

    const [result] = await connection.query(

        `
        INSERT INTO lignes_commandes
        (
            id_commande,
            id_medicament,
            quantite,
            prix_unitaire,
            sous_total
        )

        VALUES (?,?,?,?,?)

        `,

        [

            id_commande,
            id_medicament,
            quantite,
            prix_unitaire,
            sous_total

        ]

    );

    return result;

}



export async function listerLignesCommande(
    connection,
    id_commande
) {

    const [rows] = await connection.query(

        `
        SELECT

            lc.*,

            m.nom_medicament,

            m.image

        FROM lignes_commandes lc

        INNER JOIN medicaments m

        ON lc.id_medicament = m.id_medicament

        WHERE lc.id_commande = ?

        `,

        [

            id_commande

        ]

    );

    return rows;

}



export async function supprimerLignesCommande(
    connection,
    id_commande
) {

    const [result] = await connection.query(

        `
        DELETE

        FROM lignes_commandes

        WHERE id_commande = ?

        `,

        [

            id_commande

        ]

    );

    return result;

}


export async function trouverLignesCommande(
    connection,
    id_commande
){

    const [rows] = await connection.query(

        `
        SELECT

        lc.*,

        m.nom_medicament,
        m.image

        FROM lignes_commandes lc

        INNER JOIN medicaments m

        ON lc.id_medicament = m.id_medicament


        WHERE lc.id_commande = ?

        `,

        [
            id_commande
        ]

    );


    return rows;

}

export async function trouverLignesCommandeAvecStock(
    connection,
    id_commande
){

    const [rows] = await connection.query(

        `
        SELECT

        lc.id_medicament,
        lc.quantite,

        s.id_stock

        FROM lignes_commandes lc


        INNER JOIN stocks s

        ON lc.id_medicament = s.id_medicament


        WHERE lc.id_commande = ?

        `,

        [

            id_commande

        ]

    );


    return rows;

}

export async function trouverProduitsFacture(
    connection,
    id_commande
){

    const [rows] = await connection.query(

        `
        SELECT

        m.nom_medicament,

        lc.quantite,

        lc.prix_unitaire,

        lc.sous_total


        FROM lignes_commandes lc


        INNER JOIN medicaments m

        ON lc.id_medicament = m.id_medicament


        WHERE lc.id_commande = ?

        `,

        [

            id_commande

        ]

    );


    return rows;

}