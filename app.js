import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.send('WELCOME TO SUBSCRIPTION TRACKER!');
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});