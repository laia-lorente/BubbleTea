const fs = require('fs');
const path = require('path');

// Load .env manually — no dotenv dependency needed
const envFile = path.resolve(__dirname, '../.env');
if (fs.existsSync(envFile)) {
  fs.readFileSync(envFile, 'utf-8')
    .split('\n')
    .forEach(line => {
      const [key, ...rest] = line.split('=');
      if (key && rest.length) process.env[key.trim()] = rest.join('=').trim();
    });
}

const env = process.env;

const content = `export const environment = {
  production: ${env.PRODUCTION === 'true' ? 'true' : 'false'},
  firebase: {
    apiKey: '${env.FIREBASE_API_KEY}',
    authDomain: '${env.FIREBASE_AUTH_DOMAIN}',
    projectId: '${env.FIREBASE_PROJECT_ID}',
    storageBucket: '${env.FIREBASE_STORAGE_BUCKET}',
    messagingSenderId: '${env.FIREBASE_MESSAGING_SENDER_ID}',
    appId: '${env.FIREBASE_APP_ID}',
  },
  apiUrl: '${env.API_URL}',
};
`;

const outPath = path.resolve(__dirname, '../src/environments/environment.ts');
fs.writeFileSync(outPath, content);
console.log(`Generated ${outPath}`);
