import app from './app.js';

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
