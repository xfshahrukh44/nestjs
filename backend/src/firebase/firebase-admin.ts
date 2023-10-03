import * as admin from 'firebase-admin';
import * as path from "path";

// console.log((path.join(__dirname, 'fbase.json')).replace('dist', 'src'));

const serviceAccount = require((path.join(__dirname, 'fbase.json')).replace('dist', 'src')); // Path to your Firebase SDK credentials JSON file

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

export const firebaseAdmin = admin;
