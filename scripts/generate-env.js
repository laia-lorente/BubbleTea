const fs = require('fs');
const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

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
