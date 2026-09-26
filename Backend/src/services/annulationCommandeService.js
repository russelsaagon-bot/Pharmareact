import pool from "../config/database.js";


import {
    trouverCommandeParId,
    modifierStatutCommande
} from "../Models/commandeModel.js";


import {
    trouverLignesCommandeAvecStock
} from "../Models/ligneCommandeModel.js";


import {
    augmenterStock
} from "../Models/stockModel.js";


import {
    creerMouvement
} from "../Models/mouvementStockModel.js";


import {
    ajouterHistorique
} from "../Models/historiqueStockModel.js";


import {
    ajouterJournal
} from "../Models/journalModel.js";


export async function annulerCommandeService(
    id_commande,
    id_utilisateur
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



if(commande.statut === "livree"){

throw new Error(
"Une commande livrée ne peut pas être annulée"
);

}



const lignes =
await trouverLignesCommandeAvecStock(

connection,

id_commande

);



for(const ligne of lignes){



const [stockAvant] =
await connection.query(

`
SELECT quantite
FROM stocks
WHERE id_stock = ?
`,

[ligne.id_stock]

);



await augmenterStock(

connection,

ligne.id_stock,

ligne.quantite

);



await creerMouvement(

connection,

{

id_stock:
ligne.id_stock,

quantite:
ligne.quantite,

id_utilisateur,

commentaire:
"Retour suite annulation commande"

}

);



await ajouterHistorique(

connection,

{

id_stock:
ligne.id_stock,

id_utilisateur,

ancienne_quantite:
stockAvant[0].quantite,

nouvelle_quantite:
stockAvant[0].quantite + ligne.quantite,

type_operation:
"modification"

}

);



}



await modifierStatutCommande(

connection,

id_commande,

"annulee"

);



await ajouterJournal(

connection,

{

id_utilisateur,

action:
`Annulation commande ${id_commande}`,

table_concernee:
"commandes"

}

);



await connection.commit();



return {

message:
"Commande annulée et stock restauré"

};



}catch(error){


await connection.rollback();

throw error;


}finally{


connection.release();


}


}