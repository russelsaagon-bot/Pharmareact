import pool from "../../config/database.js";
import {
  demanderPaiementMTN,
  verifierStatutPaiementMTN,
  traiterWebhookMTN
} from "./mtnMomoService.js";
import {
  demanderPaiementOrange,
  verifierStatutPaiementOrange,
  traiterWebhookOrange
} from "./orangeMoneyService.js";
import {
  trouverCommandeParId
} from "../../Models/commandeModel.js";
import {
  creerPaiement,
  trouverPaiementParCommande,
  modifierStatutPaiement
} from "../../Models/paiementModel.js";
import {
  ajouterJournal
} from "../../Models/journalModel.js";

// ============================================================
// Service Façade Mobile Money
// Gère MTN MoMo et Orange Money de manière unifiée
// ============================================================

// ------------------------------------------------------------
// Initier un paiement mobile money
// methode: "MTN_MOMO" | "ORANGE_MONEY"
// ------------------------------------------------------------
export async function initierPaiementMobileMoney(data) {
  const {
    id_commande,
    montant,
    methode,
    numero_telephone,
    description
  } = data;

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // Vérifier que la commande existe
    const commande = await trouverCommandeParId(connection, id_commande);

    if (!commande) {
      throw new Error("Commande introuvable");
    }

    // Vérifier si un paiement existe déjà
    const paiementExiste = await trouverPaiementParCommande(connection, id_commande);

    if (paiementExiste) {
      throw new Error("Cette commande possède déjà un paiement");
    }

    // Vérifier le montant
    if (Number(montant) !== Number(commande.montant_total)) {
      throw new Error("Le montant du paiement est incorrect");
    }

    // Créer le paiement en attente dans la base
    const paiement = await creerPaiement(connection, {
      id_commande,
      montant,
      methode,
      reference_transaction: null
    });

    const idPaiement = paiement.insertId;
    const referenceExterne = `CMD-${id_commande}-${Date.now()}`;

    let resultatApi;

    // Appeler l'API correspondante
    if (methode === "MTN_MOMO") {
      resultatApi = await demanderPaiementMTN({
        montant,
        numeroTelephone: numero_telephone,
        referenceExterne,
        description
      });
    } else if (methode === "ORANGE_MONEY") {
      resultatApi = await demanderPaiementOrange({
        montant,
        numeroTelephone: numero_telephone,
        referenceExterne,
        description
      });
    } else {
      throw new Error("Méthode de paiement non supportée. Utilisez MTN_MOMO ou ORANGE_MONEY");
    }

    // Mettre à jour la référence de transaction
    const referenceTransaction =
      resultatApi.reference_mtn || resultatApi.reference_orange || null;

    if (referenceTransaction) {
      await modifierStatutPaiement(
        connection,
        idPaiement,
        "en_attente",
        referenceTransaction
      );
    }

    await ajouterJournal(connection, {
      id_utilisateur: null,
      action: `Initiation paiement mobile money commande ${id_commande} via ${methode}`,
      table_concernee: "paiements"
    });

    await connection.commit();

    return {
      id_paiement: idPaiement,
      statut: "en_attente",
      reference_transaction: referenceTransaction,
      message: resultatApi.message,
      methode
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

// ------------------------------------------------------------
// Vérifier le statut d'un paiement mobile money
// ------------------------------------------------------------
export async function verifierStatutMobileMoney(idPaiement) {
  const connection = await pool.getConnection();

  try {
    const [rows] = await connection.query(
      `SELECT * FROM paiements WHERE id_paiement = ?`,
      [idPaiement]
    );

    const paiement = rows[0];

    if (!paiement) {
      throw new Error("Paiement introuvable");
    }

    if (!paiement.reference_transaction) {
      throw new Error("Aucune référence de transaction pour ce paiement");
    }

    let statutApi;

    if (paiement.methode === "MTN_MOMO") {
      const resultat = await verifierStatutPaiementMTN(paiement.reference_transaction);
      statutApi = resultat.status === "SUCCESSFUL" ? "paye" : "en_attente";
    } else if (paiement.methode === "ORANGE_MONEY") {
      const resultat = await verifierStatutPaiementOrange(paiement.reference_transaction);
      statutApi = resultat.status === "SUCCESS" ? "paye" : "en_attente";
    } else {
      throw new Error("Méthode de paiement non reconnue");
    }

    if (statutApi !== paiement.statut) {
      await modifierStatutPaiement(
        connection,
        idPaiement,
        statutApi,
        paiement.reference_transaction
      );
    }

    return {
      id_paiement: idPaiement,
      statut: statutApi,
      methode: paiement.methode
    };
  } finally {
    connection.release();
  }
}

// ------------------------------------------------------------
// Traiter un webhook MTN MoMo
// ------------------------------------------------------------
export async function traiterWebhookMTNService(body) {
  const connection = await pool.getConnection();

  try {
    const webhook = traiterWebhookMTN(body);

    if (!webhook.reference_mtn) {
      throw new Error("Référence MTN manquante dans le webhook");
    }

    // Trouver le paiement par référence
    const [rows] = await connection.query(
      `SELECT * FROM paiements WHERE reference_transaction = ?`,
      [webhook.reference_mtn]
    );

    const paiement = rows[0];

    if (!paiement) {
      throw new Error("Paiement introuvable pour cette référence MTN");
    }

    await modifierStatutPaiement(
      connection,
      paiement.id_paiement,
      webhook.statut,
      webhook.reference_mtn
    );

    await ajouterJournal(connection, {
      id_utilisateur: null,
      action: `Webhook MTN MoMo: paiement ${paiement.id_paiement} -> ${webhook.statut}`,
      table_concernee: "paiements"
    });

    return {
      id_paiement: paiement.id_paiement,
      statut: webhook.statut
    };
  } finally {
    connection.release();
  }
}

// ------------------------------------------------------------
// Traiter un webhook Orange Money
// ------------------------------------------------------------
export async function traiterWebhookOrangeService(body) {
  const connection = await pool.getConnection();

  try {
    const webhook = traiterWebhookOrange(body);

    if (!webhook.reference_orange) {
      throw new Error("Référence Orange manquante dans le webhook");
    }

    // Trouver le paiement par référence
    const [rows] = await connection.query(
      `SELECT * FROM paiements WHERE reference_transaction = ?`,
      [webhook.reference_orange]
    );

    const paiement = rows[0];

    if (!paiement) {
      throw new Error("Paiement introuvable pour cette référence Orange");
    }

    await modifierStatutPaiement(
      connection,
      paiement.id_paiement,
      webhook.statut,
      webhook.reference_orange
    );

    await ajouterJournal(connection, {
      id_utilisateur: null,
      action: `Webhook Orange Money: paiement ${paiement.id_paiement} -> ${webhook.statut}`,
      table_concernee: "paiements"
    });

    return {
      id_paiement: paiement.id_paiement,
      statut: webhook.statut
    };
  } finally {
    connection.release();
  }
}