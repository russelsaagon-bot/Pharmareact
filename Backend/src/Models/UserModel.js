import pool from "../config/database.js";

export async function getUtilisateurs() {
    const [rows] = await pool.query(
        `
        SELECT u.id_utilisateur, u.nom, u.prenom, u.email, u.telephone, 
               u.id_pharmacie, u.date_creation, r.nom_role,
               p.nom_pharmacie
        FROM utilisateurs u
        JOIN roles r ON u.id_role = r.id_role
        LEFT JOIN pharmacies p ON u.id_pharmacie = p.id_pharmacie
        ORDER BY u.date_creation DESC
        `
    );
    return rows;
}

export async function getUtilisateursParPharmacie(id_pharmacie) {
    const [rows] = await pool.query(
        `
        SELECT u.id_utilisateur, u.nom, u.prenom, u.email, u.telephone, 
               u.id_pharmacie, u.date_creation, r.nom_role
        FROM utilisateurs u
        JOIN roles r ON u.id_role = r.id_role
        WHERE u.id_pharmacie = ?
        ORDER BY u.date_creation DESC
        `,
        [id_pharmacie]
    );
    return rows;
}

export async function trouverUtilisateurParId(id) {
    const [rows] = await pool.query(
        `
        SELECT u.id_utilisateur, u.nom, u.prenom, u.email, u.telephone, 
               u.id_pharmacie, u.date_creation, r.nom_role,
               p.nom_pharmacie
        FROM utilisateurs u
        JOIN roles r ON u.id_role = r.id_role
        LEFT JOIN pharmacies p ON u.id_pharmacie = p.id_pharmacie
        WHERE u.id_utilisateur = ?
        `,
        [id]
    );
    return rows[0];
}

export async function modifierUtilisateur(id, data) {
    const { nom, prenom, telephone, id_role, id_pharmacie } = data;

    const [result] = await pool.query(
        `
        UPDATE utilisateurs
        SET nom = ?, prenom = ?, telephone = ?, id_role = ?, id_pharmacie = ?
        WHERE id_utilisateur = ?
        `,
        [nom, prenom, telephone, id_role, id_pharmacie, id]
    );

    return result;
}

export async function supprimerUtilisateur(id) {
    const [result] = await pool.query(
        `
        DELETE FROM utilisateurs
        WHERE id_utilisateur = ?
        `,
        [id]
    );
    return result;
}

export async function getRoles() {
    const [rows] = await pool.query(
        `
        SELECT * FROM roles
        ORDER BY id_role
        `
    );
    return rows;
}