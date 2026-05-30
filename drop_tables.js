const { Client } = require('pg');
const client = new Client({
  connectionString: 'postgresql://neondb_owner:npg_7xMiK1owCPuq@ep-icy-dream-al8ju9w2.c-3.eu-central-1.aws.neon.tech/neondb?sslmode=require',
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
