const url = process.env.URL ?? 'http://127.0.0.1:3000/api/auth/register';

async function main() {
  const email = `hr_${Date.now()}_${Math.random().toString(16).slice(2)}@example.com`;
  const payload = {
    name: 'HR User',
    email,
    password: 'password123',
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const text = await res.text();
  console.log(res.status, text);

  if (!res.ok) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

