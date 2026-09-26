import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./docs/swagger.js";
import path from 'path';
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename);

import pharmacieRoutes from "./routes/PharmacieRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import medicamentRoutes from "./routes/MedicamentRoutes.js";
import commandeRoutes from "./routes/commandeRoutes.js";
import paiementRoutes from "./routes/paiementRoutes.js";
import factureRoutes from "./routes/factureRoutes.js";
import livraisonRoutes from "./routes/livraisonRoutes.js";
import approvisionnementRoutes from "./routes/approvisionnementRoutes.js";
import categorieRoutes from "./routes/categorieRoutes.js";
import laboratoireRoutes from "./routes/laboratoireRoutes.js";
import fournisseurRoutes from "./routes/fournisseurRoutes.js";
import livreurRoutes from "./routes/livreurRoutes.js";
import caissiereRoutes from "./routes/caissiereRoutes.js";
import userRoutes from "./routes/UserRoutes.js";
import statistiquesRoutes from "./routes/statistiquesRoutes.js";
import mobileMoneyRoutes from "./routes/mobileMoneyRoutes.js";
import superAdminRoutes from "./routes/superAdminRoutes.js";
import stockRoutes from "./routes/stockRoutes.js";
import clientRoutes from "./routes/clientRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import factureClientRoutes from "./routes/factureClientRoutes.js";

const App = express();


// Sécurité
App.use(helmet());

// Autorise React à communiquer avec le serveur
App.use(cors());

// Permet de recevoir des données JSON
App.use(express.json({ limit: '50mb'}));
App.use(express.urlencoded({ limit: '50mb', extended: true }));

// Limitation du taux de requêtes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requêtes par IP
  message: "Trop de requêtes, veuillez réessayer plus tard."
});
App.use("/api", limiter);

// Gestion centralisée des erreurs (Error Handling Middleware)
App.use((err, req, res, next) => {
  console.error("❌ Erreur serveur non gérée :", err.stack);
  res.status(500).json({
    message: "Une erreur interne est survenue sur le serveur.",
    erreur: process.env.NODE_ENV === "development" ? err.message : undefined
  });
});
// Documentation Swagger
App.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Route d'authentification
App.use("/api/auth", authRoutes);

// Routes des pharmacies
App.use("/api/pharmacies", pharmacieRoutes);

// Routes des médicaments
App.use("/api/medicaments", medicamentRoutes);

// Routes des commandes
App.use("/api/commandes", commandeRoutes);

// Routes des paiements
App.use("/api/paiements", paiementRoutes);

// Routes des factures
App.use("/api/factures", factureRoutes);

// Routes des livraisons
App.use("/api/livraisons", livraisonRoutes);

// Routes des approvisionnements
App.use("/api/approvisionnements", approvisionnementRoutes);

// Routes des catégories
App.use("/api/categories", categorieRoutes);

// Routes des laboratoires
App.use("/api/laboratoires", laboratoireRoutes);

// Routes des fournisseurs
App.use("/api/fournisseurs", fournisseurRoutes);

// Routes des livreurs
App.use("/api/livreurs", livreurRoutes);

// Routes des caissières
App.use("/api/caissieres", caissiereRoutes);

// Routes des utilisateurs
App.use("/api/utilisateurs", userRoutes);

// Routes des statistiques
App.use("/api/statistiques", statistiquesRoutes);

// Routes du mobile money (MTN MoMo & Orange Money)
App.use("/api/mobile-money", mobileMoneyRoutes);

// Routes super admin (gestion globale)
App.use("/api/admin", superAdminRoutes);

// Routes des stocks
App.use("/api/stocks", stockRoutes);

// Routes client (profil, adresses, panier, suivi)
App.use("/api/client", clientRoutes);

// Routes des notifications
App.use("/api/notifications", notificationRoutes);

// Routes du tableau de bord
App.use("/api/dashboard", dashboardRoutes);

// Routes des factures client (téléchargement, QR code)
App.use("/api/factures-client", factureClientRoutes);

// Première route
App.get("/", (req, res) => {
  res.json({
    message: "Bienvenue sur l'API PharmaReact 🚀",
    documentation: "/api-docs"
  });
});

// Route 404
App.use((req, res) => {
  res.status(404).json({
    message: "Route introuvable"
  });
});

// Gestion globale des erreurs
App.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Erreur interne du serveur",
    erreur: err.message
  });
});

App.use(express.static(path.join(__dirname, 'public')))




export default App;