import express from 'express';

const app = express();
const port = 8000;

app.use(express.json());

app.get('/', (_request, response) => {
  response.send('Hello from the classroom server!');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});