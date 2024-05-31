import 'dotenv/config';
import express from 'express';
import 'express-async-errors';
import logger from './logger.js';
import globalErrorHandler from './middlewares/globalErrorHandler.js';

import appUserRoutes from './models/app_user/routes.js';

// Datetime Formats
const DB_DATE_FORMAT = 'YYYY-MM-DD';
const DB_DATETIME_FORMAT = 'YYYY-MM-DD hh:mm:ss';

const config = process.env;
const port = config.port;
const app = express();

// JSON
app.use(express.json());

// Routes
app.use('/api/app-user', appUserRoutes);

// Global Error Handler
app.use('*', globalErrorHandler);

// Uncaught Errors
process.on('uncaughtException', (err) => {
    logger.log('error', `\nUncaught Exception occurred...`);
    logger.log('error', err.stack);
});

app.listen(port, () => console.log(`App is listening on ${port}.`));