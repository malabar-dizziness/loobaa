import express from "express";

const app = express();
const PORT = 80;

const roundrobin = (arr: string[]) => {
    let index = 0
    let length = arr.length

    return () => {
        if (index >= length) index = 0

        return arr[index++]
    }
}

const next = roundrobin([
    'http://localhost:8080',
    'http://localhost:8081'
])

app.get('/', (req, res) => {
    console.log('Received request from', req.ip)
    console.log(req.method, req.path, `${req.protocol}/${req.httpVersion}`)
    console.log('Host:', req.hostname)
    console.log('User Agent:', req.get('User-agent'))

    fetch(next())
        .then(res => res.text())
        .then(text => res.send(text))
})

app.listen(PORT, () => {
    console.log(`server started at port: ${PORT}`)
})