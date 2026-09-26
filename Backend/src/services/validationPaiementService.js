import pool from "../config/database.js";

import {
    trouverPaiementParId,
    modifierStatutPaiement
} from "../Models/paiementModel.js";

import {
    modifierStatutCommande
} from "../Models/commandeModel.js";

import {
    ajouterJournal
} from "../Models/journalModel.js";

import {
    creerNotification
} from "../Models/notificationModel.js";



export async function validerPaiementService(
    id_paiement,
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



        if(paiement.statut === "reussi"){

            throw new Error(
                "Paiement déjà validé"
            );

        }



        // Modifier paiement

        await modifierStatutPaiement(

            connection,

            id_paiement,

            "reussi",

            reference_transaction

        );



        // Confirmer la commande

        await modifierStatutCommande(

            connection,

            paiement.id_commande,

            "confirmee"

        );



        // Notification pour le client
        const [clientRows] = await connection.query(
            `
            SELECT id_client FROM commandes WHERE id_commande = ?
            `,
            [paiement.id_commande]
        );

        if (clientRows[0]) {
            await creerNotification({
                id_utilisateur: clientRows[0].id_client,
                type: "paiement_valide",
                message: `Votre paiement pour la commande ${paiement.id_commande} a été validé`,
                id_commande: paiement.id_commande,
                id_paiement
            }, connection);
        }

        // Journal

        await ajouterJournal(

            connection,

            {

            id_utilisateur:null,

            action:
            `Paiement ${id_paiement} validé`,

            table_concernee:
            "paiements"

            }

        );



        await connection.commit();



        return {

            id_paiement,

            statut:
            "reussi",

            commande:
            paiement.id_commande

        };



    }catch(error){


        await connection.rollback();

        throw error;


    }finally{


        connection.release();

    }


}