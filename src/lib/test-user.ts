/**
 * Test utility for creating a test user for development
 */

import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';

export async function createTestUser() {
  const email = 'test@example.com';
  const password = 'test123';

  // Check if test user already exists
  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) {
    console.log('Test user already exists:', email);
    return { email, password, userId: existing.id };
  }

  // Hash password
  const hashedPassword = await hash(password, 10);

  // Create test user
  const user = await prisma.user.create({
    data: {
      email,
      name: 'Test User',
      password: hashedPassword,
    },
  });

  console.log('Test user created:', email);
  return { email, password, userId: user.id };
}

// Run if called directly
if (require.main === module) {
  createTestUser()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Error creating test user:', error);
      process.exit(1);
    });
}
