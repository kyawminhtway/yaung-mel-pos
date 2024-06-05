import 'dotenv/config';
import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import helmet from 'helmet';
import session from 'express-session';
import redis from 'redis';
import RedisStore from 'connect-redis';

// Logger
import logger from './logger.js';

// Middlewares
import globalErrorHandler from './middlewares/globalErrorHandler.js';
import CheckAuth from './middlewares/checkAuth.js';
import ValidateCSRF from './middlewares/validateCsrf.js';

// Routes
import authRoutes from './models/auth/routes.js';
import appUserRoutes from './models/app_user/routes.js';

const config = process.env;
const port = config.port;
const app = express();

// Helmet
app.use(helmet());

// CORS
app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
}));

// JSON
app.use(express.json());

// Session
let redisClient;
(async () => {
    redisClient = redis.createClient({
        host: 'localhost',
        port: 6379
    });
    redisClient.on('error', (err) => console.log(`Error connecting to redis.\n${err}`)); 
    redisClient.on('connect', () => console.log(`Redis connected.`));
    redisClient.connect();
})();
app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/app-user', CheckAuth, ValidateCSRF, appUserRoutes);

// Global Error Handler
app.use('*', globalErrorHandler);

// Uncaught Errors
process.on('uncaughtException', (err) => {
    logger.log('error', `\nUncaught Exception occurred...`);
    logger.log('error', err.stack);
});

app.listen(port, () => console.log(`App is listening on ${port}.`));