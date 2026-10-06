import express from 'express';
import cors from 'cors';
import { subjects } from './db/schema/index.js';
import subjectsRouter from './routes/subject.js';

const app = express();
const port = 8000;

if (!process.env.FRONTEND_URL) throw new Error('FRONTEND_URL is not set in .env file');

app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ['GET','PUT', 'POST' ,'DELETE'],
credentials: true

}))

app.use(express.json());

app.use('api/subjects' , subjectsRouter)

app.get('/', (_request, response) => {
  response.send('Hello from the classroom server!');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});