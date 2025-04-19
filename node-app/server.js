const express = require('express');
const apiRouter = require('./api');
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use('/api', apiRouter);  // これが重要！！

app.listen(port, () => {
  console.log(`Smart Lock app listening at http://localhost:${port}`);
});
