const WebSocket = require('ws');
const express = require('express');
const cors = require('cors');

const app = express();
const wss = new WebSocket.Server({ port: 8080 });

app.use(cors());
app.use(express.json());
app.listen(80);

app.post('/api/send', (req, res) => {
    console.log('Sending message: ' + req.body.message);
    if (req.headers.authorization) {
        // check if token is valid
        const accounts = require('./accounts.json');
        console.log(accounts);
        let validAuth = false;
        for (const account of accounts) {
            if (account.token == req.headers.authorization) {
                if (req.body.message.trim() != '') {
                    console.log(`${account.username}: ${req.body.message.trim()}`);
                    sendMessage(req.body.message.trim(), account.username);
                    res.sendStatus(200);
                } else {
                    console.log(`${account.username} tried to send an empty message!`);
                    res.setHeader('Access-Control-Allow-Origin', '*');
                    res.sendStatus(400);
                }
                validAuth = true;
                console.log('Authorized: ' + account.username);
            }
        }

        if (!validAuth) {
            res.sendStatus(401);
        }
    } else {
        res.sendStatus(401);
    }
});

app.post('/api/login', (req, res) => {
    if (req.body.username && req.body.password) {
        const accounts = require('./accounts.json');

        let validAuth = false;

        for (const account of accounts) {
            if (account.username == req.body.username && account.password == req.body.password) {
                validAuth = true;

                res.setHeader('Access-Control-Allow-Origin', '*');
                res.send(account.token);
                console.log('Login successful: ' + account.username);
                return;
            }
        }

        if (!validAuth) {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.send('');
            console.log('Login failed: username or password incorrect');
        }
    } else {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.send('');
        console.log('Login failed: username or password not provided');
    }
});

wss.on('connection', (ws, req) => {
    console.log('Client connected');
});

function sendMessage(message, sender) {
    wss.clients.forEach((ws) => {
        ws.send(JSON.stringify({ message, sender }));
        console.log('Sending message: ' + message);
    });
}