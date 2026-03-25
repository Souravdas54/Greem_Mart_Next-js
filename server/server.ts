import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors'
import cookieParser from 'cookie-parser'

import './config/oauth.config'
// import cors from 'cors'
import { connectDatabase } from './config/dbConnection';
import { createRole } from './middleware/Role.Middleware';

import passport from 'passport';
import session from 'express-session';
// import { configurePassport } from './config/oauth.config';

connectDatabase()

const app = express();

app.use(createRole)

// ROUTER
import { userRouter } from './router/user.route';
import { nurseryRouter } from './router/nursery.route';
import { OAuthrouter } from './router/oauth.route';


app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],

}))

// Body Parsers
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())


app.use(session({
    secret: process.env.SESSION_SECRET || 'MyS3cr3tK3Yforemost345',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        httpOnly: true,
        secure: false
        // secure: process.env.NODE_ENV === 'development'
    }
}));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Configure passport strategies
// configurePassport();

// User Router
app.use('/auth', userRouter)
app.use('/nursery', nurseryRouter)
app.use('/auth', OAuthrouter)

app.listen(process.env.PORT, () =>
    console.log(`Server is listening on port http://localhost:${process.env.PORT}`)
)

console.log('Registered strategies:', Object.keys((passport as any)._strategies));