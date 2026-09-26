import pool from "../config/database.js";


import {
    trouverCommandeParId
} from "../Models/commandeModel.js";

import {
    trouverLivraisonParId
} from "../Models/livraisonModel.js";


import {
    modifierStatutCommande
} from "../Models/commandeModel.js";


import {
    creerLivraison,
    trouverLivraisonParCommande,
    affecterLivreur,
    modifierStatutLivraison
} from "../Models/livraisonModel.js";


import {
    modifierStatutLivreur
} from "../Models/livreurModel.js";


import {
    ajouterJournal
} from "../Models/journalModel.js";

import {
    creerNotification
} from "../Models/notificationModel.js";


export async function creerLivraisonService(data){


const connection =
await pool.getConnection();



try{


await connection.beginTransaction();



const {

id_commande

} = data;



// Vérifier commande

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



// Vérifier si livraison existe déjà

const livraisonExiste =
await trouverLivraisonParCommande(

connection,

id_commande

);



if(livraisonExiste){

throw new Error(
"Cette commande possède déjà une livraison"
);

}



const livraison =
await creerLivraison(

connection,

data

);



await ajouterJournal(

connection,

{

id_utilisateur:null,

action:
`Création livraison commande ${id_commande}`,

table_concernee:
"livraisons"

}

);



await connection.commit();



return {

id_livraison:
livraison.insertId,

statut:
"en_attente"

};



} catch(error){


await connection.rollback();

throw error;


}finally{


connection.release();


}

}


export async function affecterLivreurService(
id_livraison,
id_livreur
){


const connection =
await pool.getConnection();



try{


await connection.beginTransaction();



await affecterLivreur(

connection,

id_livraison,

id_livreur

);



await modifierStatutLivreur(

connection,

id_livreur,

"en_livraison"

);



await modifierStatutLivraison(

connection,

id_livraison,

"en_preparation"

);



await ajouterJournal(

connection,

{

id_utilisateur:null,

action:
`Livreur ${id_livreur} affecté à livraison ${id_livraison}`,

table_concernee:
"livraisons"

}

);



await connection.commit();



return {

message:
"Livreur affecté avec succès"

};



}finally{


connection.release();


}


}


export async function changerStatutLivraisonService(
    id_livraison,
    nouveauStatut
){


const connection =
await pool.getConnection();



try{


await connection.beginTransaction();



const livraison =
await trouverLivraisonParId(

connection,

id_livraison

);



if(!livraison){

throw new Error(
"Livraison introuvable"
);

}



const transitions = {


en_attente:[

"en_preparation"

],


en_preparation:[

"en_route"

],


en_route:[

"livree"

],


livree:[]

};




if(
!transitions[livraison.statut]
.includes(nouveauStatut)

){

throw new Error(

`Impossible de passer de ${livraison.statut} à ${nouveauStatut}`

);

}




await modifierStatutLivraison(

connection,

id_livraison,

nouveauStatut

);





        // Notification pour le client
        const [clientRows] = await connection.query(
            `
            SELECT id_client FROM commandes WHERE id_commande = ?
            `,
            [livraison.id_commande]
        );

        if (clientRows[0]) {
            await creerNotification({
                id_utilisateur: clientRows[0].id_client,
                type: nouveauStatut === "livree" ? "livraison_effectuee" : "livraison_en_route",
                message: nouveauStatut === "livree" 
                    ? `Votre commande ${livraison.id_commande} a été livrée`
                    : `Votre commande ${livraison.id_commande} est en route`,
                id_commande: livraison.id_commande,
                id_livraison
            }, connection);
        }

        // Si livraison terminée

        if(nouveauStatut === "livree"){



await modifierStatutCommande(

connection,

livraison.id_commande,

"livree"

);




if(livraison.id_livreur){


await modifierStatutLivreur(

connection,

livraison.id_livreur,

"disponible"

);


}



}




await ajouterJournal(

connection,

{

id_utilisateur:null,

action:
`Livraison ${id_livraison} passée à ${nouveauStatut}`,

table_concernee:
"livraisons"

}

);




await connection.commit();



return {

id_livraison,

nouveauStatut

};



}finally{


connection.release();


}


}