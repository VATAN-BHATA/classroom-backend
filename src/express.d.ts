type RateLimitRole = 'admin' | 'teacher' | 'student' | 'guest';

declare global {
  namespace Express {
    interface Request {
      user?: {
        role?: RateLimitRole;
      };
    }
  }
}

export {};
