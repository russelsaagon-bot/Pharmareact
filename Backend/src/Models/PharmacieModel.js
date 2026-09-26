import pool from "../config/database.js";

export async function getPharmacieById(id) {

    const [rows] = await pool.query(

        "SELECT * FROM pharmacies WHERE id_pharmacie = ?",

        [id]

    );

    return rows[0];
}
export async function ajouterPharmacie(pharmacie) {

    const {
        nom_pharmacie,
        telephone,
        email,
        ville,
    } = pharmacie;

    const [result] = await pool.query(

        `INSERT INTO pharmacies
        (nom_pharmacie, telephone, email, ville)
        VALUES (?, ?, ?, ?)`,

        [
            nom_pharmacie,
            telephone,
            email,
            ville,
        ]
    );

    return result;
}

export async function creerPharmacie(pharmacie) {

    const {
        nom_pharmacie,
        logo,
        telephone,
        email,
        adresse,
        ville,
        pays,
        horaires,
        qr_code,
        quartier,
        est_de_garde
    } = pharmacie;


    const [result] = await pool.query(

        `
        INSERT INTO pharmacies
        (
            nom_pharmacie,
            logo,
            telephone,
            email,
            adresse,
            ville,
            pays,
            horaires,
            qr_code,
            quartier,
            est_de_garde
        )

        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,

        [
            nom_pharmacie,
            logo,
            telephone,
            email,
            adresse,
            ville,
            pays,
            horaires,
            qr_code,
            quartier,
            est_de_garde ? 1 : 0
        ]

    );


    return result;
}

export async function getAllPharmacies() {
  const [rows] = await pool.query(`
    SELECT p.*, COALESCE(SUM(pa.montant), 0) as chiffre_affaires
    FROM pharmacies p
    LEFT JOIN commandes c ON p.id_pharmacie = c.id_pharmacie
    LEFT JOIN paiements pa ON c.id_commande = pa.id_commande AND pa.statut = 'reussi'
    GROUP BY p.id_pharmacie
  `);
  return rows;
}
export async function modifierPharmacie(id, pharmacie) {

    const {
        nom_pharmacie,
        telephone,
        email,
        ville,
        horaires,
        adresse,
        quartier,
        est_de_garde
    } = pharmacie;

    const [result] = await pool.query(

        `UPDATE pharmacies
         SET nom_pharmacie = ?,
             telephone = ?,
             email = ?,
             ville = ?,
             horaires = ?,
             adresse = ?,
             quartier = ?,
             est_de_garde = ?
         WHERE id_pharmacie = ?`,

        [
            nom_pharmacie,
            telephone,
            email,
            ville,
            horaires,
            adresse,
            quartier,
            est_de_garde ? 1 : 0,
            id
        ]

    );

    return result;
}

export async function supprimerPharmacie(id) {

    const [result] = await pool.query(

        `DELETE FROM pharmacies
         WHERE id_pharmacie = ?`,

        [id]

    );

    return result;

}

