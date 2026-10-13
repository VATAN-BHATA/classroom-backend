import app from './app.js';

const port = Number(process.env.PORT ?? 8000);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
