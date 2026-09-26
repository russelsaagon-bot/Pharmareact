import pool from "../config/database.js";

export async function creerAdresse(data) {
    const {
        id_client,
        id_utilisateur,
        adresse,
        ville,
        quartier,
        telephone
    } = data;

    const clientId = id_client || id_utilisateur;

    const [result] = await pool.query(
        `
        INSERT INTO adresses_clients
        (
            id_client,
            adresse,
            ville,
            quartier,
            telephone
        )
        VALUES (?, ?, ?, ?, ?)
        `,
        [clientId, adresse, ville, quartier, telephone]
    );

    return result;
}

export async function getAdressesUtilisateur(id_client) {
    const [rows] = await pool.query(
        `
        SELECT * FROM adresses_clients
        WHERE id_client = ?
        `,
        [id_client]
    );
    return rows;
}

export async function trouverAdresse(id) {
    const [rows] = await pool.query(
        `
        SELECT * FROM adresses_clients
        WHERE id_adresse = ?
        `,
        [id]
    );
    return rows[0];
}

export async function modifierAdresse(id, data) {
    const { adresse, ville, quartier, telephone } = data;

    const [result] = await pool.query(
        `
        UPDATE adresses_clients
        SET adresse = ?, ville = ?, quartier = ?, telephone = ?
        WHERE id_adresse = ?
        `,
        [adresse, ville, quartier, telephone, id]
    );

    return result;
}

export async function supprimerAdresse(id) {
    const [result] = await pool.query(
        `
        DELETE FROM adresses_clients
        WHERE id_adresse = ?
        `,
        [id]
    );

    return result;
}

export async function definirAdressePrincipale(id_client, id_adresse) {
    return { message: "Adresse principale définie" };
}