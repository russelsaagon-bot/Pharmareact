import {
    creerPaiementService
} from "../services/paiementService.js";

import {
    validerPaiementService
} from "../services/validationPaiementService.js";

import {
    changerStatutPaiementService
} from "../services/statutPaiementService.js";

import pool from "../config/database.js";

export async function listerPaiements(req, res) {
    try {
        const [rows] = await pool.query(
            `
            SELECT p.*, c.numero_commande
            FROM paiements p
            LEFT JOIN commandes c ON p.id_commande = c.id_commande
            ORDER BY p.date_paiement DESC
            `
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function creerPaiement(req, res){


    try{


        const resultat =
        await creerPaiementService(

            req.body

        );



        res.status(201).json({

            message:
            "Paiement créé avec succès",

            paiement:
            resultat

        });



    }catch(error){


        res.status(400).json({

            message:
            error.message

        });


    }

}

export async function validerPaiement(req,res){


    try{


        const { id } = req.params;


        const {
            reference_transaction
        } = req.body;



        const resultat =
        await validerPaiementService(

            id,

            reference_transaction

        );



        res.status(200).json({

            message:
            "Paiement validé",

            resultat

        });



    }catch(error){


        res.status(400).json({

            message:
            error.message

        });


    }

}

export async function changerStatutPaiement(req,res){


    try{


        const { id } = req.params;


        const {

            statut,

            reference_transaction

        } = req.body;



        const resultat =
        await changerStatutPaiementService(

            id,

            statut,

            reference_transaction

        );



        res.status(200).json({

            message:
            "Statut paiement modifié",

            resultat

        });



    }catch(error){


        res.status(400).json({

            message:
            error.message

        });

    }

}