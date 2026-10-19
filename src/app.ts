import cors from 'cors';
import express from 'express';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './lib/auth.js';
import subjectRoutes from './routes/subject.js';

const app = express();

const allowedOrigin = process.env.FRONTEND_URL
  ? new URL(process.env.FRONTEND_URL).origin
  : undefined;

app.use(
  cors({
    origin: (origin, callback) => {
      const isLocalDevelopmentOrigin =
        process.env.NODE_ENV !== 'production' &&
        origin !== undefined &&
        /^https?:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin);

      if (!origin || origin === allowedOrigin || isLocalDevelopmentOrigin) {
        callback(null, true);
        return;
      }

      callback(new Error('Origin is not allowed by CORS'));
    },
    credentials: true,
  }),
);
app.all('/api/auth/*path', toNodeHandler(auth));
app.use(express.json());
app.use('/api/subjects', subjectRoutes);

app.get('/', (_request, response) => {
  response.send('Hello from the classroom server!');
});

app.use('/api', (_request, response) => {
  response.status(404).json({ error: 'API endpoint not found' });
});

export default app;
