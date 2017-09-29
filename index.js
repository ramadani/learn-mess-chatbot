const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/*
Const Data Facebook Detail Apps
*/
const APP_SECRET    = "APP_SECRET_ANDA";
const VALID_TOKEN   = "VALID TOKEN ANDA";
const SERVER_URL    = "https://c5b507c2.ngrok.io";
const ACCESS_TOKEN  = "PAGE ACCESS TOKEN";
const server = app.listen(process.env.PORT || 5000, () => {
  console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});

app.get('/', (req, res) => {
  console.log('Server Ok!');
  res.sendStatus(200);
});
