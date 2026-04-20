/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const os = require('os');

function ensureFile(filePath) {
  if (filePath && fs.existsSync(filePath)) return filePath;

  const tmp = path.join(os.tmpdir(), `resume_smoke_${Date.now()}.pdf`);
  // Minimal valid PDF header/body so mimetype sniffers don't freak out
  const pdf = `%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 300 144] /Contents 4 0 R >>\nendobj\n4 0 obj\n<< /Length 44 >>\nstream\nBT /F1 18 Tf 10 100 Td (Hello PDF) Tj ET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f \n0000000010 00000 n \n0000000060 00000 n \n0000000117 00000 n \n0000000212 00000 n \ntrailer\n<< /Root 1 0 R /Size 5 >>\nstartxref\n310\n%%EOF\n`;
  fs.writeFileSync(tmp, pdf);
  return tmp;
}

async function main() {
  const base = process.env.BASE_URL || 'http://localhost:5000';
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMWE5ZWE4MS0xZGYxLTRhYzYtYTUzYy1lMDc1MzQ0YjM4MmEiLCJlbWFpbCI6ImhyLnRlc3RAZXhhbXBsZS5jb20iLCJyb2xlIjoiSFIiLCJuYW1lIjoiSFIgVGVzdCBVc2VyIiwiaWF0IjoxNzc1NjQ2NTQ1LCJleHAiOjE3NzU2NDc0NDV9.XOvQIBbBuQ-xXF9ecKbvYOTEZcKAhZX91jjdSC5vulQ";
  const candidateId = "01a9ea81-1df1-4ac6-a53c-e075344b382a";
  const desired = process.env.FILE;

  if (!token) throw new Error('TOKEN env var is required');
  if (!candidateId) throw new Error('CANDIDATE_ID env var is required');

  const filePath = ensureFile(desired);
  const buf = fs.readFileSync(filePath);
  const fileName = path.basename(filePath);

  const form = new FormData();
  form.append('file', new Blob([buf]), fileName);

  const res = await fetch(`${base}/api/candidates/${candidateId}/resume`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: form,
  });

  const text = await res.text();
  console.log('File used:', filePath);
  console.log('Status:', res.status);
  console.log(text);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
