import pool from "../config/database.js";



import {
    trouverCommandeParId,
    listerCommandesParPharmacie
} from "../Models/commandeModel.js";


import {
    trouverLignesCommande
} from "../Models/ligneCommandeModel.js";



export async function obtenirCommandeComplete(id_commande){


    const connection = await pool.getConnection();


    try{


        const commande =
        await trouverCommandeParId(
            connection,
            id_commande
        );


        if(!commande){

            throw new Error(
                "Commande introuvable"
            );

        }


        const lignes =
        await trouverLignesCommande(
            connection,
            id_commande
        );


        return {

            commande,

            produits:lignes

        };


    }finally{


        connection.release();

    }

}




export async function obtenirCommandesPharmacie(id_pharmacie){


    const connection = await pool.getConnection();


    try{


        const commandes =
        await listerCommandesParPharmacie(

            connection,

            id_pharmacie

        );


        return commandes;


    }finally{


        connection.release();

    }

}