const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });
const client = new Client({
  connectionString: process.env.DATABASE_URI,
});
client.connect()
  .then(() => {
    console.log('Connected successfully');
    return client.end();
  })
  .catch(err => {
    console.error('Connection error', err.stack);
  });
