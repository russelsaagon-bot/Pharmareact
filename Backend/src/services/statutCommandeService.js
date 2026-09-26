import pool from "../config/database.js";


import {
    trouverCommandeParId,
    modifierStatutCommande
} from "../Models/commandeModel.js";

import {
    ajouterJournal
} from "../Models/journalModel.js";


const transitionsAutorisees = {


    en_attente : [

        "confirmee",

        "annulee"

    ],


    confirmee : [

        "en_preparation",

        "annulee"

    ],


    en_preparation : [

        "prete"

    ],


    prete : [

        "en_livraison"

    ],


    en_livraison : [

        "livree"

    ],


    livree : [],


    annulee : []


};


export async function changerStatutCommandeService(
    id_commande,
    nouveauStatut
){


    const connection = await pool.getConnection();


    try{


        await connection.beginTransaction();

        const commande =
        await trouverCommandeParId(

            connection,

            id_commande

        );


        if(!commande){

            throw new Error(
                "Commande inexistante"
            );

        }



       if(
    !transitionsAutorisees[commande.statut]
    .includes(nouveauStatut)
){

    throw new Error(

        `Impossible de passer de ${commande.statut} à ${nouveauStatut}`

    );

}

        await modifierStatutCommande(

            connection,

            id_commande,

            nouveauStatut

        );

        await ajouterJournal(

    connection,

    {

        id_utilisateur: null,

        action:
        `Modification statut commande ${id_commande}: ${commande.statut} vers ${nouveauStatut}`,

        table_concernee:
        "commandes"

    }

);

        await connection.commit();

        return {

            id_commande,

            ancien_statut:
            commande.statut,

            nouveau_statut:
            nouveauStatut

        };



    }catch(error){


        await connection.rollback();
        throw error;


    }finally{


        connection.release();


    }

}
