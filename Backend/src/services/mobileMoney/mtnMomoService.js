import axios from "axios";
import crypto from "crypto";

// ============================================================
// Service MTN MoMo (Collection - Paiement entrant)
// Documentation : https://momodeveloper.mtn.com/
// ============================================================

const ENVIRONMENT =
  process.env.MTN_MOMO_ENVIRONMENT === "production"
    ? "production"
    : "sandbox";

const BASE_URL =
  ENVIRONMENT === "production"
    ? "https://proxy.momoapi.mtn.com"
    : "https://sandbox.momodeveloper.mtn.com";

const PRIMARY_KEY = process.env.MTN_MOMO_PRIMARY_KEY;
const API_USER = process.env.MTN_MOMO_API_USER;
const API_KEY = process.env.MTN_MOMO_API_KEY;
const CALLBACK_URL = process.env.MTN_MOMO_CALLBACK_URL;
const CURRENCY = "XAF";

let tokenCache = {
  access_token: null,
  expires_at: null
};

function genererUuid() {
  return crypto.randomUUID();
}

async function obtenirToken() {
  if (
    tokenCache.access_token &&
    tokenCache.expires_at &&
    tokenCache.expires_at > Date.now()
  ) {
    return tokenCache.access_token;
  }

  const auth = Buffer.from(`${API_USER}:${API_KEY}`).toString("base64");

  try {
    const response = await axios.post(
      `${BASE_URL}/collection/token/`,
      null,
      {
        headers: {
          Authorization: `Basic ${auth}`,
          "Ocp-Apim-Subscription-Key": PRIMARY_KEY,
          "Content-Type": "application/json"
        }
      }
    );

    tokenCache = {
      access_token: response.data.access_token,
      expires_at: Date.now() + (response.data.expires_in - 60) * 1000
    };

    return tokenCache.access_token;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    throw new Error(`Erreur authentification MTN MoMo: ${message}`);
  }
}

export function validerNumeroMTN(numero) {
  const nettoye = String(numero).replace(/[\s\-+]/g, "");

  const regex = /^(237)?6[5789]\d{7}$/;

  if (!regex.test(nettoye)) {
    throw new Error(
      "Numéro MTN invalide. Utilisez un numéro au format 67XXXXXXXX, 68XXXXXXXX, 69XXXXXXXX ou +2376XXXXXXXX."
    );
  }

  if (nettoye.length === 9) {
    return `237${nettoye}`;
  }

  return nettoye;
}

export async function demanderPaiementMTN({
  montant,
  numeroTelephone,
  referenceExterne,
  description
}) {
  try {
    const token = await obtenirToken();
    const referenceId = genererUuid();
    const numeroValide = validerNumeroMTN(numeroTelephone);

    const body = {
      amount: String(montant),
      currency: CURRENCY,
      externalId: String(referenceExterne),
      payer: {
        partyIdType: "MSISDN",
        partyId: numeroValide
      },
      payerMessage: description || "Paiement pharmacie",
      payeeNote: "Paiement de votre commande"
    };

    if (CALLBACK_URL) {
      body.callbackUrl = CALLBACK_URL;
    }

    const response = await axios.post(
      `${BASE_URL}/collection/v1_0/requesttopay`,
      body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Reference-Id": referenceId,
          "X-Target-Environment": ENVIRONMENT,
          "Ocp-Apim-Subscription-Key": PRIMARY_KEY,
          "Content-Type": "application/json"
        }
      }
    );

    return {
      statut: "en_attente",
      reference_mtn: referenceId,
      message:
        "Demande de paiement envoyée. Le client doit approuver sur son téléphone via *126#.",
      http_status: response.status
    };
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    throw new Error(`Erreur MTN MoMo: ${message}`);
  }
}

export async function verifierStatutPaiementMTN(referenceId) {
  try {
    const token = await obtenirToken();

    const response = await axios.get(
      `${BASE_URL}/collection/v1_0/requesttopay/${referenceId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Target-Environment": ENVIRONMENT,
          "Ocp-Apim-Subscription-Key": PRIMARY_KEY
        }
      }
    );

    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    throw new Error(`Erreur vérification MTN MoMo: ${message}`);
  }
}

export async function verifierSoldeMTN() {
  try {
    const token = await obtenirToken();

    const response = await axios.get(
      `${BASE_URL}/collection/v1_0/account/balance`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Target-Environment": ENVIRONMENT,
          "Ocp-Apim-Subscription-Key": PRIMARY_KEY
        }
      }
    );

    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    throw new Error(`Erreur solde MTN MoMo: ${message}`);
  }
}

export function traiterWebhookMTN(body) {
  const statusMapping = {
    SUCCESSFUL: "paye",
    FAILED: "echoue",
    PENDING: "en_attente",
    REJECTED: "echoue"
  };

  return {
    reference_mtn: body.referenceId || body.externalId,
    statut: statusMapping[body.status] || "en_attente",
    donnees_brutes: body
  };
}