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
    "select column_name from information_schema.columns where table_schema='public' and table_name='User' order by ordinal_position",
  );

  console.log(r.rows.map((x) => x.column_name).join(', '));

  await c.end();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});

