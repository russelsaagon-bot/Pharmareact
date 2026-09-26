export async function creerMouvement(connection, data) {


    const {

        id_stock,
        quantite,
        id_utilisateur,
        commentaire,
        type_mouvement

    } = data;

    // Par défaut, un mouvement via creerMouvement est une entrée
    // Mais pour une vente c'est une sortie, donc on laisse le type être passé
    const type = type_mouvement || "entree";


    const [result] = await connection.query(

        `
        INSERT INTO mouvements_stock
        (
            id_stock,
            type_mouvement,
            quantite,
            commentaire,
            id_utilisateur
        )

        VALUES (?,?,?,?,?)

        `,

        [

            id_stock,
            type,
            quantite,
            commentaire,
            id_utilisateur

        ]

    );


    return result;

}


export async function creerMouvementSortie(connection,data){

    const {

        id_stock,
        quantite,
        id_utilisateur,
        commentaire

    } = data;


    const [result] = await connection.query(

        `
        INSERT INTO mouvements_stock

        (
            id_stock,
            type_mouvement,
            quantite,
            commentaire,
            id_utilisateur
        )

        VALUES (?,?,?,?,?)

        `,

        [

            id_stock,
            "sortie",
            quantite,
            commentaire,
            id_utilisateur

        ]

    );


    return result;

}
