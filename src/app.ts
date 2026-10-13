import express from 'express';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './lib/auth.js';
import classRoutes from './routes/classes.js';
import departmentRoutes from './routes/departments.js';
import enrollmentRoutes from './routes/enrollments.js';
import statsRoutes from './routes/stats.js';
import subjectRoutes from './routes/subject.js';
import userRoutes from './routes/users.js';

const app = express();

const configuredFrontendOrigin = process.env.FRONTEND_URL
  ? new URL(process.env.FRONTEND_URL).origin
  : undefined;

app.use((request, response, next) => {
  const origin = request.get('origin');
  const isLocalDevelopmentOrigin =
    process.env.NODE_ENV !== 'production' &&
    origin !== undefined &&
    /^https?:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin);

  if (origin && (origin === configuredFrontendOrigin || isLocalDevelopmentOrigin)) {
    response.vary('Origin');
    response.setHeader('Access-Control-Allow-Origin', origin);
    response.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    response.setHeader('Access-Control-Allow-Credentials', 'true');
  }

  if (request.method === 'OPTIONS') {
    response.sendStatus(204);
    return;
  }

  next();
});

app.all('/api/auth/*path', toNodeHandler(auth));
app.use(express.json());
app.use('/api/classes', classRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/users', userRoutes);

app.get('/', (_request, response) => {
  response.send('Hello from the classroom server!');
});

app.use('/api', (_request, response) => {
  response.status(404).json({ error: 'API endpoint not found' });
});

export default app;
