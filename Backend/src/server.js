import App from "./App.js";
import pool from "./config/database.js";

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Connexion à MySQL réussie !");
    connection.release();
  } catch (error) {
    console.error("❌ Erreur MySQL :", error.message);
  }

  // Démarrer le serveur après avoir monté toutes les routes
  App.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
  });
}

startServer();         
