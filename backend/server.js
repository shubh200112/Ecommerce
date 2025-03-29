const app = require('./app')
const dotenv = require('dotenv')
const connectDatabase = require('./config/database')

process.on('uncaughtException', err => {
    console.log(`ERROR:: ${err.message}`);
    console.log(` uncaught Exception`);
    server.close(() => {
        process.exit(1)
    })
})
// Setting ENV file
dotenv.config({
    path:'backend/config/config.env'
})

//connecting to database
connectDatabase()

const server = app.listen(process.env.PORT, () => {
    console.log(`SERVER STARTED ON PORT: ${process.env.PORT} in ${process.env.NODE_ENV}`);
})

process.on("unhandledRejection",err => {
    console.log(`ERROR:: ${err.message}`);
    console.log(`Shutting down the server due to unhandled Promise Rejection`);
    server.close(() => {
        process.exit(1)
    })

})
