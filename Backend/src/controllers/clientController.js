import pool from "../config/database.js";
import bcrypt from "bcrypt";
import {
    creerAdresse,
    getAdressesUtilisateur,
    trouverAdresse,
    modifierAdresse,
    supprimerAdresse,
    definirAdressePrincipale
} from "../Models/adresseModel.js";
import {
    creerPanier,
    trouverPanierUtilisateur,
    ajouterArticlePanier,
    getArticlesPanier,
    modifierQuantiteArticle,
    supprimerArticlePanier,
    viderPanier
} from "../Models/panierModel.js";

// Modifier le profil
export async function modifierProfil(req, res) {
    try {
        const id = req.utilisateur.id_utilisateur || req.utilisateur.id_client;
        const { nom, prenom, telephone } = req.body;

        const [result] = await pool.query(
            `
            UPDATE utilisateurs
            SET nom = ?, prenom = ?, telephone = ?
            WHERE id_utilisateur = ?
            `,
            [nom, prenom, telephone, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Utilisateur introuvable" });
        }

        res.json({ message: "Profil modifié avec succès" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Voir le profil
export async function voirProfil(req, res) {
    try {
        const id = req.utilisateur.id_utilisateur || req.utilisateur.id_client;

        const [rows] = await pool.query(
            `
            SELECT id_utilisateur, nom, prenom, email, telephone, date_creation
            FROM utilisateurs
            WHERE id_utilisateur = ?
            `,
            [id]
        );

        if (!rows[0]) {
            return res.status(404).json({ message: "Utilisateur introuvable" });
        }

        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Gérer les adresses
export async function ajouterAdresse(req, res) {
    try {
        const id_utilisateur = req.utilisateur.id_utilisateur || req.utilisateur.id_client;
        const resultat = await creerAdresse({ ...req.body, id_utilisateur });

        res.status(201).json({
            message: "Adresse ajoutée avec succès",
            id_adresse: resultat.insertId
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function listerAdresses(req, res) {
    try {
        const id_utilisateur = req.utilisateur.id_utilisateur || req.utilisateur.id_client;
        const adresses = await getAdressesUtilisateur(id_utilisateur);

        res.json(adresses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function modifierUneAdresse(req, res) {
    try {
        const { id } = req.params;
        const resultat = await modifierAdresse(id, req.body);

        if (resultat.affectedRows === 0) {
            return res.status(404).json({ message: "Adresse introuvable" });
        }

        res.json({ message: "Adresse modifiée avec succès" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function supprimerUneAdresse(req, res) {
    try {
        const { id } = req.params;
        const resultat = await supprimerAdresse(id);

        if (resultat.affectedRows === 0) {
            return res.status(404).json({ message: "Adresse introuvable" });
        }

        res.json({ message: "Adresse supprimée avec succès" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function definirAdressePrincipaleController(req, res) {
    try {
        const { id } = req.params;
        const id_utilisateur = req.utilisateur.id_utilisateur || req.utilisateur.id_client;

        const resultat = await definirAdressePrincipale(id_utilisateur, id);

        res.json(resultat);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Gestion du panier
export async function ajouterAuPanier(req, res) {
    try {
        const id_utilisateur = req.utilisateur.id_utilisateur || req.utilisateur.id_client;
        const { id_medicament, quantite } = req.body;

        let panier = await trouverPanierUtilisateur(id_utilisateur);

        if (!panier) {
            const resultat = await creerPanier({ id_utilisateur });
            panier = { id_panier: resultat.insertId };
        }

        await ajouterArticlePanier({
            id_panier: panier.id_panier,
            id_medicament,
            quantite
        });

        res.status(201).json({ message: "Article ajouté au panier" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function voirPanier(req, res) {
    try {
        const id_utilisateur = req.utilisateur.id_utilisateur || req.utilisateur.id_client;
        const panier = await trouverPanierUtilisateur(id_utilisateur);

        if (!panier) {
            return res.json({ articles: [], total: 0 });
        }

        const articles = await getArticlesPanier(panier.id_panier);
        const total = articles.reduce((sum, a) => sum + (a.prix * a.quantite), 0);

        res.json({ articles, total });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function modifierArticlePanier(req, res) {
    try {
        const id_utilisateur = req.utilisateur.id_utilisateur || req.utilisateur.id_client;
        const { id_medicament } = req.params;
        const { quantite } = req.body;

        const panier = await trouverPanierUtilisateur(id_utilisateur);

        if (!panier) {
            return res.status(404).json({ message: "Panier introuvable" });
        }

        await modifierQuantiteArticle(panier.id_panier, id_medicament, quantite);

        res.json({ message: "Quantité modifiée" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function retirerArticlePanier(req, res) {
    try {
        const id_utilisateur = req.utilisateur.id_utilisateur || req.utilisateur.id_client;
        const { id_medicament } = req.params;

        const panier = await trouverPanierUtilisateur(id_utilisateur);

        if (!panier) {
            return res.status(404).json({ message: "Panier introuvable" });
        }

        await supprimerArticlePanier(panier.id_panier, id_medicament);

        res.json({ message: "Article retiré du panier" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function viderLePanier(req, res) {
    try {
        const id_utilisateur = req.utilisateur.id_utilisateur || req.utilisateur.id_client;
        const panier = await trouverPanierUtilisateur(id_utilisateur);

        if (!panier) {
            return res.status(404).json({ message: "Panier introuvable" });
        }

        await viderPanier(panier.id_panier);

        res.json({ message: "Panier vidé" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Suivi de commande
export async function suivreCommande(req, res) {
    try {
        const { id } = req.params;

        const [commande] = await pool.query(
            `
            SELECT c.*, p.nom_pharmacie, p.adresse as adresse_pharmacie
            FROM commandes c
            LEFT JOIN pharmacies p ON c.id_pharmacie = p.id_pharmacie
            WHERE c.id_commande = ?
            `,
            [id]
        );

        if (!commande[0]) {
            return res.status(404).json({ message: "Commande introuvable" });
        }

        const [livraison] = await pool.query(
            `
            SELECT l.*, lv.nom as nom_livreur, lv.prenom as prenom_livreur, lv.telephone as telephone_livreur
            FROM livraisons l
            LEFT JOIN livreurs lv ON l.id_livreur = lv.id_livreur
            WHERE l.id_commande = ?
            `,
            [id]
        );

        const [paiement] = await pool.query(
            `
            SELECT * FROM paiements WHERE id_commande = ?
            `,
            [id]
        );

        res.json({
            commande: commande[0],
            livraison: livraison[0] || null,
            paiement: paiement[0] || null
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Lister les commandes du client connecté
export async function listerCommandesClient(req, res) {
    try {
        const id_utilisateur = req.utilisateur.id_utilisateur || req.utilisateur.id_client;

        const [commandes] = await pool.query(
            `
            SELECT c.*, p.nom_pharmacie
            FROM commandes c
            LEFT JOIN pharmacies p ON c.id_pharmacie = p.id_pharmacie
            WHERE c.id_client = ?
            ORDER BY c.date_commande DESC
            `,
            [id_utilisateur]
        );

        res.json(commandes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


// Recherche et filtrage des médicaments
export async function rechercherMedicaments(req, res) {
    try {
        const { q, categorie, laboratoire, prix_min, prix_max, pharmacie } = req.query;

        let sql = `
            SELECT m.*, c.nom_categorie, l.nom_laboratoire, p.nom_pharmacie, s.quantite
            FROM medicaments m
            LEFT JOIN categories c ON m.id_categorie = c.id_categorie
            LEFT JOIN laboratoires l ON m.id_laboratoire = l.id_laboratoire
            LEFT JOIN pharmacies p ON m.id_pharmacie = p.id_pharmacie
            LEFT JOIN stocks s ON m.id_medicament = s.id_medicament
            WHERE 1=1
        `;
        const params = [];

        if (q) {
            sql += ` AND (m.nom_medicament LIKE ? OR m.description LIKE ?)`;
            params.push(`%${q}%`, `%${q}%`);
        }
        if (categorie) {
            sql += ` AND m.id_categorie = ?`;
            params.push(categorie);
        }
        if (laboratoire) {
            sql += ` AND m.id_laboratoire = ?`;
            params.push(laboratoire);
        }
        if (prix_min) {
            sql += ` AND m.prix >= ?`;
            params.push(prix_min);
        }
        if (prix_max) {
            sql += ` AND m.prix <= ?`;
            params.push(prix_max);
        }
        if (pharmacie) {
            sql += ` AND m.id_pharmacie = ?`;
            params.push(pharmacie);
        }

        sql += ` ORDER BY m.nom_medicament`;

        const [rows] = await pool.query(sql, params);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}