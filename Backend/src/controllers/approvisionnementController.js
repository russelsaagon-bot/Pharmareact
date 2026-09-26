import pool from "../config/database.js";

import { creerApprovisionnement,
         trouverApprovisionnement,
         getApprovisionnementsParPharmacie,
 } 
from "../Models/approvisionnementModel.js";

import { trouverStock, augmenterStock, obtenirQuantiteStock, diminuerStock } 
from "../Models/stockModel.js";

import { creerMouvement, creerMouvementSortie } 
from "../Models/mouvementStockModel.js";

import { ajouterHistorique } 
from "../Models/historiqueStockModel.js";

import { ajouterJournal } 
from "../Models/journalModel.js";



export async function ajouterApprovisionnement(req, res) {


    const connection = await pool.getConnection();


    try {


        await connection.beginTransaction();



        const {

            id_fournisseur,

            id_medicament,

            quantite,

            prix_achat

        } = req.body;



        const id_pharmacie = req.utilisateur.id_pharmacie;

        const id_utilisateur = req.utilisateur.id_utilisateur;



        // 1 - Création de l'approvisionnement
        const approvisionnement = await creerApprovisionnement(
            connection,
            {
                id_pharmacie,
                id_fournisseur,
                id_medicament,
                quantite,
                prix_achat,
                id_utilisateur
            }
        );

        // 2 - Vérifier que le stock existe pour ce médicament
        const stock = await trouverStock(
            connection,
            id_pharmacie,
            id_medicament
        );

        if(!stock){

            throw new Error(
                "Stock introuvable pour ce médicament"
            );

        }



        // quantité avant modification

        const ancienne_quantite = stock.quantite;



        // 3 - Augmentation du stock

        await augmenterStock(

            connection,

            stock.id_stock,

            quantite

        );



        // nouvelle quantité

        const nouvelle_quantite = 
            ancienne_quantite + quantite;




        // 4 - Mouvement de stock

        await creerMouvement(

            connection,

            {

                id_stock: stock.id_stock,

                quantite,

                id_utilisateur,

                commentaire:
                "Approvisionnement fournisseur"

            }

        );




        // 5 - Historique

        await ajouterHistorique(

            connection,

            {

                id_stock: stock.id_stock,

                id_utilisateur,

                ancienne_quantite,

                nouvelle_quantite,

                type_operation:"ajout"

            }

        );




        // 6 - Journal activité

        await ajouterJournal(

            connection,

            {

                id_utilisateur,

                action:
                "Création d'un approvisionnement",

                table_concernee:
                "approvisionnements"

            }

        );




        // Validation transaction

        await connection.commit();



        res.status(201).json({

            message:
            "Approvisionnement enregistré avec succès",

            id_approvisionnement:
            approvisionnement.insertId

        });



    } catch(error){



        await connection.rollback();



        res.status(500).json({

            message:error.message

        });



    } finally {


        connection.release();

    }


}



export async function listeApprovisionnements(req,res){


try{


const approvisionnements = 
await getApprovisionnementsParPharmacie(

req.utilisateur.id_pharmacie

);



res.json(approvisionnements);



}catch(error){


res.status(500).json({

message:error.message

});


}


}


export async function detailApprovisionnement(req,res){


try{


const approvisionnement = 
await trouverApprovisionnement(

req.params.id

);



if(!approvisionnement){

return res.status(404).json({

message:"Approvisionnement introuvable"

});

}



res.json(approvisionnement);



}catch(error){


res.status(500).json({

message:error.message

});


}


}




export async function annulerApprovisionnement(req,res){


const connection = await pool.getConnection();


try{


await connection.beginTransaction();



const approvisionnement = 
await trouverApprovisionnement(
req.params.id
);



if(!approvisionnement){

throw new Error(
"Approvisionnement introuvable"
);

}



const stock = await trouverStock(

connection,

approvisionnement.id_pharmacie,

approvisionnement.id_medicament

);



const ancienne_quantite = stock.quantite;



await diminuerStock(

connection,

stock.id_stock,

approvisionnement.quantite

);



const nouvelle_quantite =
ancienne_quantite - approvisionnement.quantite;



await creerMouvementSortie(

connection,

{

id_stock:stock.id_stock,

quantite:approvisionnement.quantite,

id_utilisateur:req.utilisateur.id_utilisateur,

commentaire:
"Annulation approvisionnement"

}

);



await ajouterHistorique(

connection,

{

id_stock:stock.id_stock,

id_utilisateur:req.utilisateur.id_utilisateur,

ancienne_quantite,

nouvelle_quantite,

type_operation:"modification"

}

);



await ajouterJournal(

connection,

{

id_utilisateur:req.utilisateur.id_utilisateur,

action:
"Annulation d'un approvisionnement",

table_concernee:
"approvisionnements"

}

);



await connection.commit();



res.json({

message:
"Approvisionnement annulé avec succès"

});



}catch(error){


await connection.rollback();


res.status(500).json({

message:error.message

});


}finally{


connection.release();

}


}