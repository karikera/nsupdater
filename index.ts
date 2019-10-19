import https = require('https');
import fs = require('fs');
import os = require('os');
import { ENOENT } from 'constants';

const key = JSON.parse(fs.readFileSync('key.json', 'utf-8'));

if ('adapter' in key)
{
    const ifaces = os.networkInterfaces();
    const adapter = ifaces[key.adapter];
    if (adapter)
    {
        delete key.adapter;
        key.address = adapter[0].address;
    }
    else
    {
        console.error('Adapter not found: '+key.adapter);
        process.exit(ENOENT);
    }
}

const json = JSON.stringify(key);
const req = https.request({
    hostname: 'rua.kr',
    port: 443,
    path: '/servlet/ddns.php',
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
