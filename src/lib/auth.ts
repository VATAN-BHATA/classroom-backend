import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';

import { db } from '../db/index.js'; // your drizzle instance
import * as schema from '../db/schema/auth.js';

const frontendOrigin = process.env.FRONTEND_URL
  ? new URL(process.env.FRONTEND_URL).origin
  : undefined;

if (!frontendOrigin) {
  throw new Error('FRONTEND_URL is not defined');
}

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET!,
  trustedOrigins: [
    frontendOrigin,
    ...(process.env.NODE_ENV === 'production'
      ? []
      : ['http://localhost:*', 'http://127.0.0.1:*']),
  ],
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: 'string',
        required: true,
        defaultValue: 'student',
        input: true, // Allow role to be set during registration
      },
      imageCldPubId: {
        type: 'string',
        required: false,
        input: true, // Allow imageCldPubId to be set during registration
      },
    },
  },
});
