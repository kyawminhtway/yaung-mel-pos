import pg from 'pg';

const config = process.env;
const pool = new pg.Pool({
    database: config.db,
    host: config.dbhost,
    user: config.dbuser,
    password: config.dbpassword,
    port: config.dbport,
});

export default pool;