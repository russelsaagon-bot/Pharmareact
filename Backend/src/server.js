import App from "./App.js";
import pool from "./config/database.js";

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Connexion à MySQL réussie !");
    connection.release();

    App.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur le port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Erreur de connexion à MySQL :", error.message);
    process.exit(1);
  }
}

startServer();   
