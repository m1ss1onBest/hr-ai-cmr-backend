const { Client } = require('pg');

(async () => {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('DATABASE_URL is not set');
    process.exit(1);
  }

  const c = new Client({ connectionString });
  await c.connect();

  const r = await c.query(
    "select column_name, data_type, is_nullable from information_schema.columns where table_schema='public' and table_name='User' and column_name='name'",
  );

  if (r.rows.length === 0) {
    console.error('MISSING: public."User"."name"');
    process.exitCode = 2;
  } else {
    console.log(`OK: name column exists: ${JSON.stringify(r.rows[0])}`);
  }

  await c.end();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});

