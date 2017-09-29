require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

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

app.post('/webhook', (req, res) => {
  if (req.body.object === 'page') {
    req.body.entry.forEach((entry) => {
      if (entry.messaging) {
        entry.messaging.forEach((event) => {
          if (event.message && event.message.text) {
            sendMessage(event);
            console.log(event);
          }
        });
      }
    });
    res.status(200).end();
  }
});

function sendMessage(event) {
  let sender = event.sender.id;
  let text = event.message.text;

  /* Test Data */
  console.log("Dikirim ke %s ", sender);

  request({
    url: 'https://graph.facebook.com/v2.10/me/messages',
    qs: {access_token: ACCESS_TOKEN},
    method: 'POST',
    json: {
      recipient: {id: sender},
      message: {text: text}
    }
  }, function (error, response) {
    if (error) {
        console.log('Error sending message: ', error);
    } else if (response.body.error) {
        console.log('Error: ', response.body.error);
    }
  });
}
