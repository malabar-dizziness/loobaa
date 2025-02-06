import { app } from "./be";

const PORT = 8080

app.listen(PORT, () => {
    console.log(`server started at port: ${PORT}`)
})