const express = require('express');
const app = express();
const port = 3056;

app.get('/', (req, res) => {
  res.send('Hello from Node.js and Express running in Docker!');
});

app.listen(port, () => {
  console.log(`Express app listening at http://localhost:${port}`);
});