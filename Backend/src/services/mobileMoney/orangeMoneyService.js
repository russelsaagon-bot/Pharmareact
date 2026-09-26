import axios from "axios";

// ============================================================
// Service Orange Money (Paiement entrant)
// Documentation : https://developer.orange.com/
// ============================================================

const ENVIRONMENT =
  process.env.ORANGE_MONEY_ENVIRONMENT === "production"
    ? "production"
    : "sandbox";

const BASE_URL =
  ENVIRONMENT === "production"
    ? "https://api.orange.com"
    : "https://api.orange.com";

const CLIENT_ID = process.env.ORANGE_MONEY_CLIENT_ID;
const CLIENT_SECRET = process.env.ORANGE_MONEY_CLIENT_SECRET;
const MERCHANT_NUMBER = process.env.ORANGE_MONEY_MERCHANT_NUMBER;
const MERCHANT_NAME = process.env.ORANGE_MONEY_MERCHANT_NAME;
const CALLBACK_URL = process.env.ORANGE_MONEY_CALLBACK_URL;
const CURRENCY = "XAF";

let tokenCache = {
  access_token: null,
  expires_at: null
};

async function obtenirToken() {
  if (
    tokenCache.access_token &&
    tokenCache.expires_at &&
    tokenCache.expires_at > Date.now()
  ) {
    return tokenCache.access_token;
  }

  const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");

  try {
    const response = await axios.post(
      `${BASE_URL}/oauth/v3/token`,
      "grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded"
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
    throw new Error(`Erreur authentification Orange Money: ${message}`);
  }
}

export function validerNumeroOrange(numero) {
  const nettoye = String(numero).replace(/[\s\-+]/g, "");

  const regex = /^(237)?6[5-9]\d{7}$/;

  if (!regex.test(nettoye)) {
    throw new Error(
      "Numéro Orange invalide. Utilisez un numéro au format 65XXXXXXXX, 66XXXXXXXX, 69XXXXXXXX ou +2376XXXXXXXX."
    );
  }

  if (nettoye.length === 9) {
    return `237${nettoye}`;
  }

  return nettoye;
}

export async function demanderPaiementOrange({
  montant,
  numeroTelephone,
  referenceExterne,
  description
}) {
  try {
    const token = await obtenirToken();
    const numeroValide = validerNumeroOrange(numeroTelephone);

    const body = {
      amount: {
        unit: CURRENCY,
        value: String(montant)
      },
      reference: String(referenceExterne),
      customer: {
        phoneNumber: numeroValide
      },
      description: description || "Paiement pharmacie",
      merchant: {
        phoneNumber: MERCHANT_NUMBER,
        name: MERCHANT_NAME
      }
    };

    if (CALLBACK_URL) {
      body.notificationUrl = CALLBACK_URL;
    }

    const response = await axios.post(
      `${BASE_URL}/orange-money-webpay/cm/v1/webpayment`,
      body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    return {
      statut: "en_attente",
      reference_orange: response.data.payToken || response.data.orderId,
      message:
        "Demande de paiement envoyée. Le client doit approuver sur son téléphone.",
      http_status: response.status
    };
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    throw new Error(`Erreur Orange Money: ${message}`);
  }
}

export async function verifierStatutPaiementOrange(referenceId) {
  try {
    const token = await obtenirToken();

    const response = await axios.get(
      `${BASE_URL}/orange-money-webpay/cm/v1/transactionstatus/${referenceId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    throw new Error(`Erreur vérification Orange Money: ${message}`);
  }
}

export function traiterWebhookOrange(body) {
  const statusMapping = {
    SUCCESS: "paye",
    FAILED: "echoue",
    PENDING: "en_attente",
    CANCELED: "echoue"
  };

  return {
    reference_orange: body.payToken || body.orderId || body.reference,
    statut: statusMapping[body.status] || "en_attente",
    donnees_brutes: body
  };
}