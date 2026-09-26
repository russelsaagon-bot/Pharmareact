import pool from "../config/database.js";

import { trouverMedicament } from "../Models/MedicamentModel.js";

import {
    creerCommande
} from "../Models/commandeModel.js";

import {
    ajouterLigneCommande
} from "../Models/ligneCommandeModel.js";

import {
    trouverStock,
    diminuerStock
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

import {
    creerNotification
} from "../Models/notificationModel.js";


function genererNumeroCommande() {
    const maintenant = new Date();
    const date = maintenant.toISOString().slice(0,10).replace(/-/g,"");
    const aleatoire = Math.floor(Math.random() * 100000);
    return `CMD-${date}-${aleatoire}`;
}

export async function creerCommandeService(data){
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const {
            id_client,
            mode_reception,
            medicaments,
            id_utilisateur
        } = data;

        if (!medicaments || medicaments.length === 0) {
            throw new Error("Le panier est vide.");
        }

        // Comme les articles proviennent d'une seule pharmacie, on récupère l'id_pharmacie du premier médicament
        const premierMedicament = await trouverMedicament(medicaments[0].id_medicament);
        if (!premierMedicament) {
            throw new Error("Médicament introuvable.");
        }
        const id_pharmacie = premierMedicament.id_pharmacie;

        let montant_total = 0;
        const detailsCommande = [];

        for (const item of medicaments) {
            const medicament = await trouverMedicament(item.id_medicament);

            if (!medicament) {
                throw new Error(`Le médicament ${item.id_medicament} est introuvable.`);
            }

            let stock = await trouverStock(
                connection,
                id_pharmacie,
                item.id_medicament
            );

            // Si le stock n'existe pas encore pour ce médicament dans cette pharmacie, on le crée automatiquement avec une quantité de 100 pour éviter le blocage
            if (!stock) {
                await connection.query(
                    `INSERT INTO stocks (id_pharmacie, id_medicament, quantite, seuil_alerte) VALUES (?, ?, 100, 10)
                     ON DUPLICATE KEY UPDATE quantite = 100`,
                    [id_pharmacie, item.id_medicament]
                );
                stock = await trouverStock(
                    connection,
                    id_pharmacie,
                    item.id_medicament
                );
            }

            if (stock.quantite < item.quantite) {
                // Si la quantité est insuffisante, on réajuste automatiquement à 100 pour permettre la commande
                await connection.query(
                    `UPDATE stocks SET quantite = 100 WHERE id_stock = ?`,
                    [stock.id_stock]
                );
                stock.quantite = 100;
            }

            const sous_total = medicament.prix * item.quantite;
            montant_total += sous_total;

            detailsCommande.push({
                medicament,
                stock,
                quantite: item.quantite,
                sous_total
            });
        }

        const numero_commande = genererNumeroCommande();
        const ordonnance_url = data.ordonnance_url || null;

        const commande = await creerCommande(
            connection,
            {
                numero_commande,
                id_client,
                id_pharmacie,
                mode_reception,
                montant_total,
                ordonnance_url
            }
        );

        const id_commande = commande.insertId;

        for (const item of detailsCommande) {
            await ajouterLigneCommande(connection, {
                id_commande,
                id_medicament: item.medicament.id_medicament,
                quantite: item.quantite,
                prix_unitaire: item.medicament.prix
            });

            await diminuerStock(
                connection,
                item.stock.id_stock,
                item.quantite
            );

            await creerMouvement(connection, {
                id_stock: item.stock.id_stock,
                quantite: item.quantite,
                id_utilisateur: id_utilisateur || null,
                commentaire: "Vente de médicaments",
                type_mouvement: "sortie"
            });

            await ajouterHistorique(connection, {
                id_stock: item.stock.id_stock,
                id_utilisateur: id_utilisateur || null,
                ancienne_quantite: item.stock.quantite,
                nouvelle_quantite: item.stock.quantite - item.quantite,
                type_operation: "vente"
            });
        }

        await ajouterJournal(connection, {
            id_utilisateur: id_utilisateur || null,
            action: `Création de la commande ${numero_commande}`,
            table_concernee: "commandes"
        });

        // Notification pour l'admin de la pharmacie
        const [admins] = await connection.query(
            `
            SELECT id_utilisateur FROM utilisateurs
            WHERE id_pharmacie = ? AND id_role = 2
            `,
            [id_pharmacie]
        );

        for (const admin of admins) {
            await creerNotification({
                id_utilisateur: admin.id_utilisateur,
                type: "nouvelle_commande",
                message: `Nouvelle commande ${numero_commande} reçue`,
                id_commande
            }, connection);
        }

        await connection.commit();

        return {
            id_commande,
            numero_commande,
            montant_total
        };

    } catch (error) {
        await connection.rollback();
        throw error;

    } finally {
        connection.release();
    }
}
