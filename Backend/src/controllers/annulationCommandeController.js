import {
    annulerCommandeService
} from "../services/annulationCommandeService.js";



export async function annulerCommande(req, res) {


    try {


        const { id } = req.params;


        // Récupère l'utilisateur authentifié depuis le middleware
        const id_utilisateur = req.utilisateur?.id_utilisateur ?? null;

        const resultat = await annulerCommandeService(id, id_utilisateur);



        res.status(200).json({

            message:
            "Commande annulée avec succès",

            resultat

        });



    } catch(error) {


        res.status(400).json({

            message:
            error.message

        });


    }

}