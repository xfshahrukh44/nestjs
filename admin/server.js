const fs = require('fs');
const path = require('path');
const express = require('express');
const https = require('https');

const httpsOptions = {
    key: fs.readFileSync(path.join(__dirname, '', '/src/ssl/key.txt').replace('dist', 'src')),
    cert: fs.readFileSync(path.join(__dirname, '', '/src/ssl/cert.txt').replace('dist', 'src')),
};

const admin_app = express();
const admin_server = https.createServer(httpsOptions, admin_app);
const buildFolderPath = path.join(__dirname, 'out');
admin_app.use(express.static(buildFolderPath));

admin_server.listen(3014, () => {
    console.log('Admin server listening on port: ' + 3014);
});


