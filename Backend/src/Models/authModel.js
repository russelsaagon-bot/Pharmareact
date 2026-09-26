import pool from "../config/database.js";

export async function trouverUtilisateurParEmail(email) {

    const [rows] = await pool.query(

        `
        SELECT 
            utilisateurs.*,
            roles.nom_role

        FROM utilisateurs

        JOIN roles
        ON utilisateurs.id_role = roles.id_role

        WHERE utilisateurs.email = ?
        `,

        [email]

    );

    return rows[0];

}

export async function trouverClientParEmail(email) {

    const [rows] = await pool.query(

        `
        SELECT 
            utilisateurs.*,
            roles.nom_role

        FROM utilisateurs

        JOIN roles
        ON utilisateurs.id_role = roles.id_role

        WHERE utilisateurs.email = ?
        AND roles.nom_role = 'CLIENT'
        `,

        [email]

    );

    return rows[0];

}



export async function creerUtilisateur(utilisateur) {

    const {
        nom,
        prenom,
        email,
        telephone,
        mot_de_passe,
        id_role,
        id_pharmacie,
    } = utilisateur;

    const columns = [
        "nom",
        "prenom",
        "email",
        "telephone",
        "mot_de_passe",
        "id_role",
    ];
    const placeholders = ["?", "?", "?", "?", "?", "?"];
    const values = [
        nom,
        prenom,
        email,
        telephone,
        mot_de_passe,
        id_role,
    ];

    if (id_pharmacie != null) {
        columns.push("id_pharmacie");
        placeholders.push("?");
        values.push(id_pharmacie);
    }

    const [result] = await pool.query(
        `INSERT INTO utilisateurs (${columns.join(", ")})
         VALUES (${placeholders.join(", ")})`,
        values
    );

    return result;

}

export async function creerAdministrateurPharmacie(utilisateur){

    const {

        nom,
        prenom,
        email,
        telephone,
        mot_de_passe,
        id_pharmacie

    } = utilisateur;



    const id_role = 2;



    const [result] = await pool.query(

        `
        INSERT INTO utilisateurs
        (
        nom,
        prenom,
        email,
        telephone,
        mot_de_passe,
        id_role,
        id_pharmacie
        )

        VALUES(?,?,?,?,?,?,?)
        `,

        [
            nom,
            prenom,
            email,
            telephone,
            mot_de_passe,
            id_role,
            id_pharmacie
        ]

    );


    return result;

}

export async function creerClient(client){

    const {
        nom,
        prenom,
        email,
        telephone,
        mot_de_passe
    } = client;


    const id_role = 3;


    const [result] = await pool.query(

        `
        INSERT INTO utilisateurs
        (
        nom,
        prenom,
        email,
        telephone,
        mot_de_passe,
        id_role,
        id_pharmacie
        )

        VALUES(?,?,?,?,?,?,?)
        `,

        [
            nom,
            prenom,
            email,
            telephone,
            mot_de_passe,
            id_role,
            null
        ]

    );


    return result;

}

export async function creerLivreurUtilisateur(data) {
    const {
        nom,
        prenom,
        email,
        telephone,
        mot_de_passe,
        id_pharmacie
    } = data;

    const id_role = 4; // LIVREUR

    const [result] = await pool.query(
        `
        INSERT INTO utilisateurs
        (nom, prenom, email, telephone, mot_de_passe, id_role, id_pharmacie)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        [nom, prenom, email, telephone, mot_de_passe, id_role, id_pharmacie]
    );

    return result;
}

export async function creerCaissiereUtilisateur(data) {
    const {
        nom,
        prenom,
        email,
        telephone,
        mot_de_passe,
        id_pharmacie
    } = data;

    const id_role = 5; // CAISSIERE

    const [result] = await pool.query(
        `
        INSERT INTO utilisateurs
        (nom, prenom, email, telephone, mot_de_passe, id_role, id_pharmacie)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        [nom, prenom, email, telephone, mot_de_passe, id_role, id_pharmacie]
    );

    return result;
}
