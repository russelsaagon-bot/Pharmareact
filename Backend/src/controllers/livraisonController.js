import {
    creerLivraisonService,
    affecterLivreurService
} from "../services/livraisonService.js";

import {
    changerStatutLivraisonService
} from "../services/livraisonService.js";

import {
    listerLivraisonsParLivreur
} from "../Models/livraisonModel.js";



// Création livraison

export async function creerLivraison(req,res){


    try{


        const resultat =
        await creerLivraisonService(

            req.body

        );


        res.status(201).json({

            message:
            "Livraison créée avec succès",

            livraison:
            resultat

        });



    }catch(error){


        res.status(400).json({

            message:
            error.message

        });


    }

}




// Affectation livreur

export async function affecterLivreur(req,res){


    try{


        const {

            id

        } = req.params;



        const {

            id_livreur

        } = req.body;



        const resultat =
        await affecterLivreurService(

            id,

            id_livreur

        );



        res.status(200).json({

            message:
            "Livreur affecté",

            resultat

        });



    }catch(error){


        res.status(400).json({

            message:
            error.message

        });


    }

}

export async function changerStatutLivraison(req,res){


try{


const {id}=req.params;


const {

statut

}=req.body;



const resultat =
await changerStatutLivraisonService(

id,

statut

);



res.status(200).json({

message:
"Statut livraison modifié",

resultat

});



}catch(error){


res.status(400).json({

message:
error.message

});


}


}

// Livreur : voir ses livraisons
export async function listerLivraisonsLivreur(req, res) {
    try {
        const idUtilisateur = req.utilisateur?.id_utilisateur;
        const livraisons = await listerLivraisonsParLivreur(idUtilisateur);
        res.json(livraisons);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
