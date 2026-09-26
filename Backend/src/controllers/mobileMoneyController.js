import {
  initierPaiementMobileMoney,
  verifierStatutMobileMoney,
  traiterWebhookMTNService,
  traiterWebhookOrangeService
} from "../services/mobileMoney/mobileMoneyService.js";

// ------------------------------------------------------------
// Initier un paiement mobile money (MTN MoMo ou Orange Money)
// POST /api/mobile-money/payer
// ------------------------------------------------------------
export async function initierPaiementMobile(req, res) {
  try {
    const resultat = await initierPaiementMobileMoney(req.body);

    res.status(201).json({
      message: "Paiement mobile money initié avec succès",
      paiement: resultat
    });
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
}

// ------------------------------------------------------------
// Vérifier le statut d'un paiement mobile money
// GET /api/mobile-money/statut/:id
// ------------------------------------------------------------
export async function verifierStatutPaiement(req, res) {
  try {
    const { id } = req.params;

    const resultat = await verifierStatutMobileMoney(id);

    res.status(200).json({
      message: "Statut du paiement vérifié",
      paiement: resultat
    });
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
}

// ------------------------------------------------------------
// Webhook MTN MoMo (callback)
// POST /api/mobile-money/webhook/mtn
// ------------------------------------------------------------
export async function webhookMTN(req, res) {
  try {
    const resultat = await traiterWebhookMTNService(req.body);

    res.status(200).json({
      message: "Webhook MTN traité",
      resultat
    });
  } catch (error) {
    console.error("Erreur webhook MTN:", error.message);
    res.status(200).json({
      message: "Webhook reçu"
    });
  }
}

// ------------------------------------------------------------
// Webhook Orange Money (callback)
// POST /api/mobile-money/webhook/orange
// ------------------------------------------------------------
export async function webhookOrange(req, res) {
  try {
    const resultat = await traiterWebhookOrangeService(req.body);

    res.status(200).json({
      message: "Webhook Orange traité",
      resultat
    });
  } catch (error) {
    console.error("Erreur webhook Orange:", error.message);
    res.status(200).json({
      message: "Webhook reçu"
    });
  }
}