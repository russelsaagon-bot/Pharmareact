import pool from "../config/database.js";


import {
    trouverFactureComplete
} from "../Models/factureModel.js";


import {
    trouverProduitsFacture
} from "../Models/ligneCommandeModel.js";



export async function obtenirFactureComplete(
    id_facture
){


const connection =
await pool.getConnection();



try{


const facture =
await trouverFactureComplete(

connection,

id_facture

);



if(!facture){

throw new Error(
"Facture introuvable"
);

}



const produits =
await trouverProduitsFacture(

connection,

facture.id_commande

);



return {

facture:{

id_facture:
facture.id_facture,

numero_facture:
facture.numero_facture,

qr_code:
facture.qr_code,

montant:
facture.montant,

date:
facture.date_facture

},


commande:{

numero:
facture.numero_commande,

statut:
facture.statut,

mode_reception:
facture.mode_reception

},


client:{

nom:
facture.nom,

prenom:
facture.prenom,

telephone:
facture.telephone,

email:
facture.email

},


produits


};


}finally{


connection.release();


}


}