import pool from "../config/database.js";


// Ajouter un médicament

export async function ajouterMedicament(data){

    const {

        nom_medicament,
        description,
        image,
        prix,
        date_expiration,
        numero_lot,
        id_categorie,
        id_laboratoire,
        id_pharmacie,
        qr_code

    } = data;


    const [result] = await pool.query(

        `
        INSERT INTO medicaments
        (
        nom_medicament,
        description,
        image,
        prix,
        date_expiration,
        numero_lot,
        id_categorie,
        id_laboratoire,
        id_pharmacie,
        qr_code
        )

        VALUES (?,?,?,?,?,?,?,?,?,?)
        `,

        [
            nom_medicament,
            description,
            image,
            prix,
            date_expiration,
            numero_lot,
            id_categorie,
            id_laboratoire,
            id_pharmacie,
            qr_code
        ]

    );


    return result;

}



// Récupérer tous les médicaments d'une pharmacie

export async function getMedicamentsParPharmacie(id_pharmacie){

    const [rows] = await pool.query(

        `
        SELECT *
        FROM medicaments
        WHERE id_pharmacie = ?
        `,

        [id_pharmacie]

    );


    return rows;

}



// Trouver un médicament

export async function trouverMedicament(id){

    const [rows] = await pool.query(

        `
        SELECT *
        FROM medicaments
        WHERE id_medicament = ?
        `,

        [id]

    );


    return rows[0];

}



// Modifier médicament

export async function modifierMedicament(id,data){


    const {

        nom_medicament,
        description,
        prix

    } = data;



    const [result] = await pool.query(

        `
        UPDATE medicaments

        SET 
        nom_medicament=?,
        description=?,
        prix=?

        WHERE id_medicament=?

        `,

        [

        nom_medicament,
        description,
        prix,
        id

        ]

    );


    return result;

}



// Suppression logique

export async function supprimerMedicament(id){


    const [result] = await pool.query(

        `
        UPDATE medicaments

        SET est_supprime = 1

        WHERE id_medicament=?

        `,

        [id]

    );


    return result;

}