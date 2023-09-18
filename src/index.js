import express from 'express'
import cookies from 'cookie-parser'
import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv'
import { connectApp } from './config/index.js'
import route from './routes/index.js'
import { notFound, errorHandler } from './middlewares/index.js'

dotenv.config()

/*****************************Config application*******************************/
const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(morgan('combined'))
app.use(cors({
    origin: [
        process.env.FRONTEND_HOST,
        'http://localhost:3000',
    ],
    credentials: true
}))
app.use(cookies(process.env.COOKIE_SECRET))
/******************************************************************************/
//Connect to the database and start the server
connectApp(app)
//routing for application
route(app)
//ERROR Handler middleware
app.use(notFound)
app.use(errorHandler)

