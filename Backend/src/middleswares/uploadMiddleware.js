import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Dossier de destination pour les uploads
const dossierUploads = path.join(__dirname, "..", "Upload", "medicaments");

// Créer le dossier s'il n'existe pas
if (!fs.existsSync(dossierUploads)) {
  fs.mkdirSync(dossierUploads, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, dossierUploads);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
});

export { upload };
export default upload;
// Dossier de destination pour les ordonnances
const dossierOrdonnances = path.join(__dirname, "..", "Upload", "ordonnances");

if (!fs.existsSync(dossierOrdonnances)) {
  fs.mkdirSync(dossierOrdonnances, { recursive: true });
}

export const uploadOrdonnance = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, dossierOrdonnances);
    },
    filename: (req, file, cb) => {
      cb(null, "ordonnance-" + Date.now() + path.extname(file.originalname));
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5Mo max
});