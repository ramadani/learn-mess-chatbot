require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/*
Const Data Facebook Detail Apps
*/
const APP_SECRET    = process.env.APP_SECRET;
const VALID_TOKEN   = process.env.VALID_TOKEN;
const SERVER_URL    = process.env.SERVER_URL;
const ACCESS_TOKEN  = process.env.ACCESS_TOKEN;
const server = app.listen(process.env.PORT || 5000, () => {
  console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});

app.get('/', (req, res) => {
  console.log('Server Ok!');
  res.sendStatus(200);
});

app.get('/webhook', (req, res) => {
  if (req.query['hub.mode'] && req.query['hub.verify_token'] === VALID_TOKEN) {
      res.status(200).send(req.query['hub.challenge']);
  } else {
      res.status(403).end();
  }
});
