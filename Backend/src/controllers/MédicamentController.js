import pool from "../config/database.js";
import {
  ajouterMedicament,
  getMedicamentsParPharmacie,
  trouverMedicament,
  modifierMedicament,
  supprimerMedicament,
} from "../Models/MedicamentModel.js";
import { creerStock } from "../Models/stockModel.js";
import { ajouterHistorique } from "../Models/historiqueStockModel.js";
import {
  genererQRCode
} from "../utils/generateQr.js";




// Ajouter

export async function createMedicament(req,res){

    try {

        const qr_code = await genererQRCode({
            nom: req.body.nom_medicament,
            pharmacie: req.utilisateur.id_pharmacie,
            date: Date.now()
        });

        const medicament = {
            ...req.body,
            id_pharmacie: req.utilisateur.id_pharmacie,
            qr_code
        };

        const resultat = await ajouterMedicament(medicament);

        const idMedicament = resultat.insertId;

        const stock = await creerStock({
            id_pharmacie: req.utilisateur.id_pharmacie,
            id_medicament: idMedicament,
            qr_code
        });

        const connection = await pool.getConnection();
        try {
            await ajouterHistorique(connection, {
                id_stock: stock.insertId,
                id_utilisateur: req.utilisateur.id_utilisateur,
                ancienne_quantite: 0,
                nouvelle_quantite: 0,
                type_operation: "ajout"
            });
        } finally {
            connection.release();
        }

        res.status(201).json({
            message: "Médicament ajouté avec succès",
            id_medicament: idMedicament,
            id_stock: stock.insertId
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

}





// Liste

export async function listeMedicaments(req,res){

try{


const medicaments =

await getMedicamentsParPharmacie(

req.params.id_pharmacie

);



res.json(medicaments);



}catch(error){


res.status(500).json({

message:error.message

});


}

}





// Détail

export async function detailMedicament(req,res){

try{


const medicament =

await trouverMedicament(

req.params.id

);



if(!medicament){

return res.status(404).json({

message:"Médicament introuvable"

});

}



res.json(medicament);



}catch(error){

res.status(500).json({

message:error.message

});

}

}





// Modifier

export async function updateMedicament(req,res){

try{


await modifierMedicament(

req.params.id,

req.body

);



res.json({

message:"Médicament modifié"

});



}catch(error){

res.status(500).json({

message:error.message

});

}

}





// Supprimer

export async function deleteMedicament(req,res){

try{


await supprimerMedicament(

req.params.id

);



res.json({

message:"Médicament supprimé"

});



}catch(error){

res.status(500).json({

message:error.message

});

}

}