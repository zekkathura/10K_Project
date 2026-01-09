/**
 * Generate Apple Sign In JWT for Supabase
 *
 * This script generates a JWT client secret required by Supabase
 * for Apple Sign In authentication.
 *
 * Usage: node scripts/generate-apple-jwt.js
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Apple Sign In credentials
const TEAM_ID = '2Q7J3T4MVU';
const KEY_ID = '52YH4S6482';
const CLIENT_ID = 'com.tenk.scorekeeper.web'; // Services ID

// Path to your .p8 key file
const KEY_FILE = path.join(__dirname, '..', 'secrets', 'AuthKey_52YH4S6482.p8');

// JWT validity (Apple allows up to 6 months)
const EXPIRY_DAYS = 180;

function base64UrlEncode(buffer) {
  return buffer
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

function generateAppleJWT() {
  // Read the private key
  const privateKey = fs.readFileSync(KEY_FILE, 'utf8');

  // JWT Header
  const header = {
    alg: 'ES256',
    kid: KEY_ID,
    typ: 'JWT'
  };

  // JWT Payload
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: TEAM_ID,
    iat: now,
    exp: now + (EXPIRY_DAYS * 24 * 60 * 60),
    aud: 'https://appleid.apple.com',
    sub: CLIENT_ID
  };

  // Encode header and payload
  const encodedHeader = base64UrlEncode(Buffer.from(JSON.stringify(header)));
  const encodedPayload = base64UrlEncode(Buffer.from(JSON.stringify(payload)));

  // Create signature
  const signatureInput = `${encodedHeader}.${encodedPayload}`;
  const sign = crypto.createSign('SHA256');
  sign.update(signatureInput);
  const signature = sign.sign(privateKey);

  // Convert DER signature to raw format (required for ES256)
  // ES256 signatures from Node.js are in DER format, need to convert to raw r||s format
  const derSignature = signature;

  // Parse DER signature to get r and s values
  let offset = 2; // Skip sequence tag and length
  if (derSignature[1] > 0x80) {
    offset += derSignature[1] - 0x80;
  }

  // Parse r
  offset++; // Skip integer tag
  let rLength = derSignature[offset++];
  if (rLength > 0x80) {
    const lenBytes = rLength - 0x80;
    rLength = 0;
    for (let i = 0; i < lenBytes; i++) {
      rLength = (rLength << 8) | derSignature[offset++];
    }
  }
  let r = derSignature.slice(offset, offset + rLength);
  offset += rLength;

  // Parse s
  offset++; // Skip integer tag
  let sLength = derSignature[offset++];
  if (sLength > 0x80) {
    const lenBytes = sLength - 0x80;
    sLength = 0;
    for (let i = 0; i < lenBytes; i++) {
      sLength = (sLength << 8) | derSignature[offset++];
    }
  }
  let s = derSignature.slice(offset, offset + sLength);

  // Pad or trim r and s to 32 bytes each
  const padTo32 = (buf) => {
    if (buf.length === 32) return buf;
    if (buf.length > 32) return buf.slice(buf.length - 32);
    const padded = Buffer.alloc(32);
    buf.copy(padded, 32 - buf.length);
    return padded;
  };

  r = padTo32(r);
  s = padTo32(s);

  const rawSignature = Buffer.concat([r, s]);
  const encodedSignature = base64UrlEncode(rawSignature);

  // Combine to form JWT
  const jwt = `${encodedHeader}.${encodedPayload}.${encodedSignature}`;

  return jwt;
}

// Generate and output the JWT
try {
  const jwt = generateAppleJWT();

  console.log('\n========================================');
  console.log('Apple Sign In JWT for Supabase');
  console.log('========================================\n');
  console.log('Copy the entire JWT below (it\'s one long string):\n');
  console.log(jwt);
  console.log('\n========================================');
  console.log(`Valid for: ${EXPIRY_DAYS} days`);
  console.log('Expires: ' + new Date(Date.now() + EXPIRY_DAYS * 24 * 60 * 60 * 1000).toLocaleDateString());
  console.log('========================================\n');
  console.log('IMPORTANT: Apple OAuth secrets expire every 6 months.');
  console.log('Set a reminder to regenerate this JWT before it expires.\n');
} catch (error) {
  console.error('Error generating JWT:', error.message);
  process.exit(1);
}
