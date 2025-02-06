import { app } from "./be";

const PORT = 8081

app.listen(PORT, () => {
    console.log(`server started at port: ${PORT}`)
})