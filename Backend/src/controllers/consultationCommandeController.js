import {
    obtenirCommandeComplete,
    obtenirCommandesPharmacie

} from "../services/consultationCommandeService.js";




export async function voirCommande(req,res){

    try{

        const { id } = req.params;


        const commande =
        await obtenirCommandeComplete(id);



        res.status(200).json({

            message:
            "Commande récupérée avec succès",

            data: commande

        });



    }catch(error){


        res.status(404).json({

            message:error.message

        });


    }

}




export async function voirCommandesPharmacie(req,res){


    try{


        const { id_pharmacie } = req.params;


        const commandes =
        await obtenirCommandesPharmacie(
            id_pharmacie
        );


        res.status(200).json({

            message:
            "Liste des commandes récupérée",

            commandes

        });



    }catch(error){


        res.status(500).json({

            message:error.message

        });


    }

}

