// define the connection to the db (see: https://node-postgres.com/features/connecting)
const { Pool } = require('pg');
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'ellieDB',
    password: 'Ellie_Qu33n.',
    port: 5432,
});

module.exports = {
    query: (text, params, callback) => {
        return pool.query(text, params, callback);
    },
}