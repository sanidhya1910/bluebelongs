#!/usr/bin/env node
// Generate a PBKDF2 password hash compatible with workers/booking-api.js.
//
// The algorithm here MUST stay in sync with hashPassword() in the worker:
//   PBKDF2-HMAC-SHA256, 210,000 iterations, 16-byte random salt, 32-byte output,
//   serialized as  pbkdf2$<iterations>$<saltB64url>$<hashB64url>
//
// Usage:
//   node generate-hash.js 'your-new-password'
//
// Then store the printed value in users.password_hash (see
// database/reset-admin-password.sql).

const PBKDF2_ITERATIONS = 210000;

function base64url(bytes) {
  return Buffer.from(bytes)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

async function main() {
  const password = process.argv[2];
  if (!password) {
    console.error("Usage: node generate-hash.js '<password>'");
    process.exit(1);
  }

  const { webcrypto } = await import('node:crypto');
  const { subtle } = webcrypto;
  const encoder = new TextEncoder();

  const salt = webcrypto.getRandomValues(new Uint8Array(16));
  const keyMaterial = await subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );
  const bits = await subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
    keyMaterial,
    256
  );

  const hash = `pbkdf2$${PBKDF2_ITERATIONS}$${base64url(salt)}$${base64url(new Uint8Array(bits))}`;
  console.log(hash);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
