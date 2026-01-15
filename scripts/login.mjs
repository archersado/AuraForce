#!/usr/bin/env node

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const args = process.argv.slice(2);
  const email = args[0] || 'test@example.com';
  const password = args[1] || 'test123';

  console.log(`Attempting to login with ${email}...`);

  // Find user
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user || !user.password) {
    console.error('User not found or has no password');
    process.exit(1);
  }

  // Verify password
  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    console.error('Invalid password');
    process.exit(1);
  }

  // Generate session token

  function generateToken() {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
  }

  const token = generateToken();

  // Set expiry to 7 days
  const expires = new Date();
  expires.setDate(expires.getDate() + 7);

  // Create session in database
  const session = await prisma.session.create({
    data: {
      sessionToken: token,
      userId: user.id,
      expires,
    },
  });

  console.log('\n=== Login Successful ===');
  console.log(`User: ${user.email} (${user.name || 'No name'})`);
  console.log(`Session Token: ${token}`);
  console.log(`Expires: ${expires.toISOString()}`);
  console.log('\n=== For Testing APIs ===');
  console.log(`curl -b 'auraforce-session=${token}' http://localhost:3000/api/workflows`);

  await prisma.$disconnect();
}

main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
