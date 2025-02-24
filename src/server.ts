import { app } from "./be";

const server = (port: number) => {
    app.listen(port, () => {
        console.log('Server started listening at port', port)
    })
}

for (var i = 8080; i<=8082 ; i++) {
    server(i)
}