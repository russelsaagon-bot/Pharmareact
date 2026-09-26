import pool from "../config/database.js";

// Télécharger une facture (génère un fichier texte/PDF simple)
export async function telechargerFacture(req, res) {
    try {
        const { id } = req.params;

        const [rows] = await pool.query(
            `
            SELECT f.*, c.numero_commande, c.date_commande, u.nom, u.prenom, u.email, u.telephone,
                   p.nom_pharmacie, p.adresse as adresse_pharmacie, p.telephone as telephone_pharmacie
            FROM factures f
            JOIN commandes c ON f.id_commande = c.id_commande
            JOIN utilisateurs u ON c.id_client = u.id_utilisateur
            LEFT JOIN pharmacies p ON c.id_pharmacie = p.id_pharmacie
            WHERE f.id_facture = ?
            `,
            [id]
        );

        const facture = rows[0];

        if (!facture) {
            return res.status(404).json({ message: "Facture introuvable" });
        }

        // Récupérer les lignes de la commande
        const [lignes] = await pool.query(
            `
            SELECT lc.*, m.nom_medicament
            FROM lignes_commandes lc
            JOIN medicaments m ON lc.id_medicament = m.id_medicament
            WHERE lc.id_commande = ?
            `,
            [facture.id_commande]
        );

        // Générer le contenu HTML de la facture avec QR Code
        let lignesHtml = '';
        for (const ligne of lignes) {
            lignesHtml += `<tr>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">${ligne.nom_medicament}</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">${ligne.quantite}</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">${ligne.prix_unitaire} FCFA</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">${ligne.sous_total} FCFA</td>
            </tr>`;
        }

        const htmlContent = `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
            <meta charset="UTF-8">
            <title>Facture ${facture.numero_facture}</title>
            <style>
                body { font-family: Arial, sans-serif; color: #333; margin: 0; padding: 20px; background: #fff; }
                .invoice-box { max-width: 800px; margin: auto; padding: 30px; border: 1px solid #eee; box-shadow: 0 0 10px rgba(0, 0, 0, 0.15); }
                .header-table, .details-table { width: 100%; border-collapse: collapse; }
                .header-table td { vertical-align: top; padding-bottom: 20px; }
                .title { font-size: 26px; font-weight: bold; color: #2c3e50; }
                .details-table th, .details-table td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
                .details-table th { background-color: #f8f9fa; color: #2c3e50; }
                .qr-section { margin-top: 30px; text-align: center; border-top: 2px dashed #eee; padding-top: 20px; }
                .qr-section img { width: 140px; height: 140px; }
                .no-print { margin: 20px 0; text-align: center; }
                .btn { background-color: #3498db; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; font-size: 16px; text-decoration: none; }
                .btn:hover { background-color: #2980b9; }
                @media print { .no-print { display: none; } .invoice-box { border: none; box-shadow: none; padding: 0; } }
            </style>
        </head>
        <body>
            <div class="no-print">
                <button class="btn" onclick="window.print()">Imprimer / Enregistrer en PDF</button>
            </div>
            <div class="invoice-box">
                <table class="header-table">
                    <tr>
                        <td>
                            <div class="title">FACTURE</div>
                            <div><strong>N° :</strong> ${facture.numero_facture}</div>
                            <div><strong>Date :</strong> ${new Date(facture.date_facture).toLocaleString('fr-FR')}</div>
                            <div><strong>N° Commande :</strong> ${facture.numero_commande}</div>
                        </td>
                        <td style="text-align: right;">
                            <div style="font-size: 18px; font-weight: bold; color: #27ae60;">${facture.nom_pharmacie || 'Pharmacie'}</div>
                            <div>${facture.adresse_pharmacie || ''}</div>
                            <div>Tél : ${facture.telephone_pharmacie || 'N/A'}</div>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2" style="padding-top: 10px;">
                            <strong>Client :</strong> ${facture.nom} ${facture.prenom} | <strong>Email :</strong> ${facture.email} | <strong>Tél :</strong> ${facture.telephone || 'N/A'}
                        </td>
                    </tr>
                </table>

                <table class="details-table">
                    <thead>
                        <tr>
                            <th>Médicament</th>
                            <th style="text-align: center;">Quantité</th>
                            <th style="text-align: right;">Prix unitaire</th>
                            <th style="text-align: right;">Sous-total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${lignesHtml}
                    </tbody>
                </table>

                <div style="margin-top: 20px; text-align: right; font-size: 18px; color: #2c3e50;">
                    <strong>Total à payer : ${facture.montant} FCFA</strong>
                </div>

                ${facture.qr_code ? `
                <div class="qr-section">
                    <p style="margin-bottom: 10px; color: #7f8c8d; font-size: 13px;">Scannez ce QR Code pour vérifier l'authenticité de la facture</p>
                    <img src="${facture.qr_code}" alt="QR Code Facture">
                </div>
                ` : ''}
            </div>
        </body>
        </html>
        `;

        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.send(htmlContent);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Scanner le QR code d'une facture
export async function scannerQrFacture(req, res) {
    try {
        const { numero_facture } = req.params;

        const [rows] = await pool.query(
            `
            SELECT f.*, c.numero_commande, u.nom, u.prenom
            FROM factures f
            JOIN commandes c ON f.id_commande = c.id_commande
            JOIN utilisateurs u ON c.id_client = u.id_utilisateur
            WHERE f.numero_facture = ?
            `,
            [numero_facture]
        );

        const facture = rows[0];

        if (!facture) {
            return res.status(404).json({ message: "Facture introuvable" });
        }

        res.json({
            id_facture: facture.id_facture,
            numero_facture: facture.numero_facture,
            montant: facture.montant,
            date_facture: facture.date_facture,
            numero_commande: facture.numero_commande,
            client: `${facture.nom} ${facture.prenom}`
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}