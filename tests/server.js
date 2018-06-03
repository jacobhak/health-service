const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.route('/').get((req, res) => res.send('OK'));

app.route('/ok').get((req, res) => res.send('OK'));

app.route('/notok').get((req, res) => {
  res.status(500);
  res.send('not OK');
});

app.route('/timeout').get((req, res) => {
  setTimeout(() => {
    res.send('OK');
  }, 40000);
});

app.listen(4712);
console.log('listening on port 4712');
