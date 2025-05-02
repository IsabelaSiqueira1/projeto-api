import pg from 'pg';
const { Pool } = pg;

export const pool = new Pool({
    user: 'postgres',
    host: 'postgres',
    database: 'postgres',
    password: 'postgres',
    port: 5432,
});
