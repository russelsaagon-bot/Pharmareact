import 'dotenv/config';
import mysql from 'mysql2/promise';
import jwt from 'jsonwebtoken';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 3306,
});

function sign(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '24h' });
}

async function pickSampleIds() {
  const conn = await pool.getConnection();
  try {
    const [[client]] = await conn.query('SELECT id_client FROM clients LIMIT 1');
    const [[user]] = await conn.query('SELECT id_utilisateur, id_pharmacie FROM utilisateurs LIMIT 1');
    const [[pharm]] = await conn.query('SELECT id_pharmacie FROM pharmacies LIMIT 1');
    const [[med]] = await conn.query('SELECT id_medicament FROM medicaments LIMIT 1');
    return {
      clientId: client?.id_client || null,
      userId: user?.id_utilisateur || null,
      userPharmacie: user?.id_pharmacie || null,
      pharmacieId: pharm?.id_pharmacie || null,
      medicamentId: med?.id_medicament || null,
    };
  } finally {
    conn.release();
  }
}

async function run() {
  const ids = await pickSampleIds();
  console.log('Sample ids:', ids);

  const clientToken = sign({ id: ids.clientId, type: 'client' });
  const adminToken = sign({ id: ids.userId, type: 'utilisateur', role: 'ADMIN_PHARMACIE', id_pharmacie: ids.userPharmacie || ids.pharmacieId });
  const superToken = sign({ id: ids.userId, type: 'utilisateur', role: 'SUPER_ADMIN' });

  const base = 'http://localhost:' + (process.env.PORT || 5000);

  async function req(path, method = 'GET', token = null, body = null) {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = 'Bearer ' + token;
    const res = await fetch(base + path, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    const text = await res.text();
    let json;
    try { json = JSON.parse(text); } catch(e) { json = text; }
    return { status: res.status, body: json };
  }

  console.log('\n1) Create commande as CLIENT');
  const createCommandePayload = {
    id_pharmacie: ids.pharmacieId,
    mode_reception: 'livraison',
    medicaments: [{ id_medicament: ids.medicamentId, quantite: 1 }]
  };
  const r1 = await req('/api/commandes', 'POST', clientToken, createCommandePayload);
  console.log('Status', r1.status, 'Body', r1.body);

  console.log('\n2) Create approvisionnement as ADMIN_PHARMACIE');
  const approvPayload = { id_fournisseur: 1, id_medicament: ids.medicamentId, quantite: 5, prix_achat: 100 };
  const r2 = await req('/api/approvisionnements', 'POST', adminToken, approvPayload);
  console.log('Status', r2.status, 'Body', r2.body);

  console.log('\n3) List pharmacies (public)');
  const r3 = await req('/api/pharmacies');
  console.log('Status', r3.status, 'Body sample:', Array.isArray(r3.body) ? r3.body.slice(0,2) : r3.body);

  await pool.end();
}

run().catch(err => { console.error(err); process.exit(1); });
