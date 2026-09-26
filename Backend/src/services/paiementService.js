import pool from "../config/database.js";


import {
    trouverCommandeParId
} from "../Models/commandeModel.js";


import {
    creerPaiement,
    trouverPaiementParCommande,
    modifierStatutPaiement
} from "../Models/paiementModel.js";


import {
    ajouterJournal
} from "../Models/journalModel.js";


export async function creerPaiementService(data){


    const connection =
    await pool.getConnection();


    try{


        await connection.beginTransaction();



        const {

            id_commande,
            montant,
            methode,
            reference_transaction

        } = data;



        // Vérifier que la commande existe

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



        // Vérifier si un paiement existe déjà

        const paiementExiste =
        await trouverPaiementParCommande(

            connection,

            id_commande

        );



        if(paiementExiste){

            throw new Error(
                "Cette commande possède déjà un paiement"
            );

        }



        // Vérifier le montant

        if(Number(montant) !== Number(commande.montant_total)){


            throw new Error(

                "Le montant du paiement est incorrect"

            );

        }



        const paiement =
        await creerPaiement(

            connection,

            {

            id_commande,

            montant,

            methode,

            reference_transaction

            }

        );



        await ajouterJournal(

            connection,

            {

            id_utilisateur:null,

            action:
            `Création paiement commande ${id_commande}`,

            table_concernee:
            "paiements"

            }

        );



        await connection.commit();



        return {

            id_paiement:
            paiement.insertId,

            statut:
            "en_attente"

        };



    }catch(error){


        await connection.rollback();

        throw error;


    }finally{


        connection.release();

    }


}