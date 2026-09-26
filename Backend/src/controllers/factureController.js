import {
    genererFactureService
} from "../services/factureService.js";



export async function genererFacture(req,res){


    try{


        const { id } = req.params;



        const resultat =
        await genererFactureService(

            id

        );



        res.status(201).json({

            message:
            "Facture générée avec succès",

            facture:
            resultat

        });



    }catch(error){


        res.status(400).json({

            message:
            error.message

        });


    }

}

import {
    obtenirFactureComplete
} from "../services/consultationFactureService.js";



export async function voirFacture(req,res){


try{


const {id}=req.params;



const resultat =
await obtenirFactureComplete(id);



res.status(200).json({

facture:
resultat

});


}catch(error){


res.status(404).json({

message:
error.message

});


}


}