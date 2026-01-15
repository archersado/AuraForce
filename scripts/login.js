const http = require('http');

const email = 'test@example.com';
const password = 'test123';

const data = JSON.stringify({
  email,
  password,
  rememberMe: false,
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/auth/signin',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data),
  },
};

const req = http.request(options, (res) => {
  let body = '';
  const cookies = [];

  res.on('data', (chunk) => {
    body += chunk;
  });

  res.on('end', () => {
    const setCookieHeader = res.headers['set-cookie'];
    if (setCookieHeader) {
      setCookieHeader.forEach(c => {
        cookies.push(c.split(';')[0]);
      });
    }

    console.log('Response:', body);
    console.log('\n=== SESSION COOKIES ===');
    cookies.forEach(c => console.log(c));
    console.log('========================\n');

    console.log('\nUse curl with cookies:');
    const cookieStr = cookies.join('; ');
    console.log(`curl -b "${cookieStr}" http://localhost:3000/api/workflows\n`);

    // Also test the API immediately
    console.log('\n=== TESTING API ===');
    const http2 = require('http');

    const req2 = http2.request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/workflows',
      method: 'GET',
      headers: {
        'Cookie': cookieStr,
      },
    }, (res2) => {
      let body2 = '';
      res2.on('data', (c) => body2 += c);
      res2.on('end', () => {
        console.log('API Response status:', res2.statusCode);
        console.log('API Response body:');
        console.log(body2);
      });
    });
    req2.end();
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
});

req.write(data);
req.end();
