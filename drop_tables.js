const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URI,
});
async function run() {
  await client.connect();
  console.log("Connected to DB.");
  try {
    await client.query(`
      DROP TYPE IF EXISTS enum_orders_payment_info_payment_status CASCADE;
    `);
    console.log("Dropped specific conflicting type successfully.");
  } catch (err) {
    console.error("Error dropping tables:", err);
  } finally {
    await client.end();
  }
}
run();
