import { creerCommandeService } 
from "../services/commandeService.js";



export async function creerCommande(req, res) {
    try {
        const body = { ...req.body };
        
        if (req.file) {
            body.ordonnance_url = req.file.path;
        }

        // Si les médicaments viennent sous forme de string JSON (en cas de FormData avec fichier), on les parse
        if (typeof body.medicaments === "string") {
            try {
                body.medicaments = JSON.parse(body.medicaments);
            } catch (e) {
                // Ignore parsing error if already array or handle later
            }
        }

        // Résoudre l'ID client de manière robuste
        const idClient = req.utilisateur?.id_client || req.utilisateur?.id_utilisateur || body.id_client;
        if (idClient) {
            body.id_client = idClient;
        }

        const resultat = await creerCommandeService(body);

        res.status(201).json({
            message: "Commande créée avec succès",
            commande: resultat
        });
    } catch(error) {
        console.error("❌ Erreur lors de la création de la commande :", error);
        res.status(400).json({
            message: error.message || "Erreur lors de la création de la commande",
            stack: process.env.NODE_ENV === "development" ? error.stack : undefined
        });
    }
}

import {
    changerStatutCommandeService
} from "../services/statutCommandeService.js";



export async function changerStatut(req,res){


    try{


        const { id } = req.params;


        const {
            statut
        } = req.body;



        const resultat =
        await changerStatutCommandeService(

            id,

            statut

        );



        res.status(200).json({

            message:
            "Statut modifié avec succès",

            resultat

        });



    }catch(error){


        res.status(400).json({

            message:error.message

        });


    }

}