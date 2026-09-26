import pool from "../config/database.js";


import {
    trouverCommandeParId
} from "../Models/commandeModel.js";


import {
    trouverPaiementParCommande
} from "../Models/paiementModel.js";


import {
    creerFacture,
    trouverFactureParCommande
} from "../Models/factureModel.js";

import QRCode from "qrcode";


function genererNumeroFacture(){

    const date = new Date()

    .toISOString()

    .slice(0,10)

    .replace(/-/g,"");


    const nombre =
    Math.floor(Math.random()*10000);



    return `FAC-${date}-${nombre}`;

}



export async function genererFactureService(
    id_commande
){


const connection =
await pool.getConnection();



try{


await connection.beginTransaction();



const commande =
await trouverCommandeParId(

connection,

id_commande

);



if(!commande){

throw new Error(
"Commande inexistante"
);

}



const paiement =
await trouverPaiementParCommande(

connection,

id_commande

);



if(!paiement || paiement.statut !== "reussi"){


throw new Error(

"Impossible de créer la facture : paiement non validé"

);

}



const factureExiste =
await trouverFactureParCommande(

connection,

id_commande

);



if(factureExiste){

throw new Error(
"Facture déjà générée"
);

}



const numero_facture =
genererNumeroFacture();


const donneesQR = {

    numero_facture,

    id_commande,

    montant: commande.montant_total,

    date: new Date()

};

const qr_code = await QRCode.toDataURL(

    JSON.stringify(donneesQR)

);



const facture =
await creerFacture(

connection,

{

id_commande,

numero_facture,

qr_code,

montant:
commande.montant_total

}

);



await connection.commit();



return {

id_facture:
facture.insertId,

numero_facture,

qr_code,

montant:
commande.montant_total

};



}finally{


connection.release();

}


}