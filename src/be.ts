import express from "express";

export const app = express();

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    console.log('Received request from', req.ip)
    console.log(req.method, req.path, `${req.protocol}/${req.httpVersion}`)
    console.log('Host:', req.hostname)
    console.log('User Agent:', req.get('User-agent'))

    console.log('Response from server:', `${req.protocol}/${req.httpVersion}`, res.statusCode)

    const data = { message: `Hello from web server running at localhost:${req.socket.localPort}` };
    res.render('webpage', data);
})