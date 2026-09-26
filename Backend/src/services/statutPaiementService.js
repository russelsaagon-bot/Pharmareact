import pool from "../config/database.js";

import {
    trouverPaiementParId,
    modifierStatutPaiement
} from "../Models/paiementModel.js";

import {
    ajouterJournal
} from "../Models/journalModel.js";



const statutsPossibles = [

    "en_attente",
    "reussi",
    "echoue",
    "annule"

];



export async function changerStatutPaiementService(
    id_paiement,
    nouveauStatut,
    reference_transaction
){


    const connection =
    await pool.getConnection();



    try{


        await connection.beginTransaction();



        const paiement =
        await trouverPaiementParId(

            connection,

            id_paiement

        );



        if(!paiement){


            throw new Error(
                "Paiement introuvable"
            );

        }



        if(!statutsPossibles.includes(nouveauStatut)){


            throw new Error(
                "Statut paiement invalide"
            );

        }



        if(paiement.statut === "reussi"){


            throw new Error(
                "Un paiement réussi ne peut plus être modifié"
            );

        }



        await modifierStatutPaiement(

            connection,

            id_paiement,

            nouveauStatut,

            reference_transaction

        );



        await ajouterJournal(

            connection,

            {

            id_utilisateur:null,

            action:
            `Paiement ${id_paiement} passé à ${nouveauStatut}`,

            table_concernee:
            "paiements"

            }

        );



        await connection.commit();



        return {

            id_paiement,

            ancien_statut:
            paiement.statut,

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