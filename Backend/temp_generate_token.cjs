const crypto = require('crypto');
function base64url(obj){
  return Buffer.from(JSON.stringify(obj)).toString('base64')
    .replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_');
}
const header = { alg: 'HS256', typ: 'JWT' };
const payload = { id_utilisateur: 2, role: 'admin', id_pharmacie: 1, exp: Math.floor(Date.now()/1000) + 24*3600 };
const secret = 'pharmareact_secret_2026';
const unsigned = base64url(header) + '.' + base64url(payload);
const sig = crypto.createHmac('sha256', secret).update(unsigned).digest('base64').replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_');
console.log(unsigned + '.' + sig);
