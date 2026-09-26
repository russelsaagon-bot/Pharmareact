const http = require('http');
function request(path, data) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(data);
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    }, (res) => {
      let chunks = '';
      res.on('data', (chunk) => chunks += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: chunks }));
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}
(async () => {
  try {
    const reg = await request('/api/auth/register', {
      nom: 'Test',
      prenom: 'User',
      email: 'testuser4@example.com',
      telephone: '0123456789',
      mot_de_passe: 'Test1234',
      id_role: 1,
    });
    console.log('REGISTER', reg.status, reg.body);
    const login = await request('/api/auth/login', {
      email: 'testuser4@example.com',
      mot_de_passe: 'Test1234',
    });
    console.log('LOGIN', login.status, login.body);
  } catch (error) {
    console.error('ERROR', error.message || error);
  }
})();
