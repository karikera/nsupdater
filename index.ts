import https = require('https');
import fs = require('fs');
import os = require('os');
import path = require('path');
import { ENOENT } from 'constants';

const key = JSON.parse(fs.readFileSync(__dirname+path.sep+'key.json', 'utf-8'));

if ('adapter' in key)
{
    delete key.address;
    
    const ifaces = os.networkInterfaces();
    const adapters = ifaces[key.adapter];
    if (adapters)
    {
        if (key.family)
        {
            for (const adapter of adapters)
            {
                if (adapter.family == key.family)
                {
                    key.address = adapter.address;
                    break;
                }
            }
            delete key.family;
        }
        else
        {
            key.address = adapters[0].address;
        }
    }
    
    if (!key.address)
    {
        console.error('Adapter not found: '+key.adapter);
        process.exit(ENOENT);
    }
    delete key.adapter;
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
