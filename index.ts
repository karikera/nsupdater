import https = require('https');
import fs = require('fs');

const json = JSON.stringify(JSON.parse(fs.readFileSync('key.json', 'utf-8')));

const req = https.request({
    hostname: 'rua.kr',
    port: 443,
    path: '/post.php',
    method: 'POST',
    headers: {
         'Content-Type': 'text/json',
         'Content-Length': json.length
       }
}, (resp) => {
    console.log('statusCode:', resp.statusCode);
    console.log('headers:', resp.headers);
    
    resp.on('data', chunk => {
        console.log(chunk.toString('utf8'));
    });
});
req.write(json);
req.end();
