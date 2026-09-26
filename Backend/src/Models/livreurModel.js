import pool from "../config/database.js";

export async function creerLivreur(data) {
    const { nom, prenom, telephone, email, id_pharmacie, id_utilisateur } = data;

    const [result] = await pool.query(
        `
        INSERT INTO livreurs
        (nom, prenom, telephone, email, id_pharmacie, id_utilisateur, statut)
        VALUES (?, ?, ?, ?, ?, ?, 'disponible')
        `,
        [nom, prenom, telephone, email, id_pharmacie, id_utilisateur]
    );

    return result;
}

export async function getLivreurs() {
    const [rows] = await pool.query(
        `
        SELECT l.*, p.nom_pharmacie
        FROM livreurs l
        LEFT JOIN pharmacies p ON l.id_pharmacie = p.id_pharmacie
        ORDER BY l.nom
        `
    );
    return rows;
}

export async function getLivreursParPharmacie(id_pharmacie) {
    const [rows] = await pool.query(
        `
        SELECT * FROM livreurs
        WHERE id_pharmacie = ?
        ORDER BY nom
        `,
        [id_pharmacie]
    );
    return rows;
}

export async function trouverLivreur(id) {
    const [rows] = await pool.query(
        `
        SELECT * FROM livreurs
        WHERE id_livreur = ?
        `,
        [id]
    );
    return rows[0];
}

export async function modifierLivreur(id, data) {
    const { nom, prenom, telephone, email } = data;

    const [result] = await pool.query(
        `
        UPDATE livreurs
        SET nom = ?, prenom = ?, telephone = ?, email = ?
        WHERE id_livreur = ?
        `,
        [nom, prenom, telephone, email, id]
    );

    return result;
}

export async function supprimerLivreur(id) {
    const [result] = await pool.query(
        `
        DELETE FROM livreurs
        WHERE id_livreur = ?
        `,
        [id]
    );
    return result;
}

export async function modifierStatutLivreur(
    connection,
    id_livreur,
    statut
){

    const [result] = await connection.query(

        `
        UPDATE livreurs

        SET statut = ?

        WHERE id_livreur = ?

        `,

        [

            statut,

            id_livreur

        ]

    );


    return result;

}