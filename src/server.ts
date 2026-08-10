import app from "./app"
import config from "./config"
import { prisma } from "./lib/prisma"

/// imported config folder auto points to the index file inside it 
/// cause index file points to the root folder where it currenty locate
const PORT  = config.port

async function main() {
    try {

        await prisma.$connect() // optional to check if connected or not
        console.log("Connected to the database sucessfully")
        

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    } catch (error) {
        console.error("Error starting the server : ", error)
        await prisma.$disconnect()
        process.exit(1)
    }
}

main()