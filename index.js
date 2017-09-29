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
const API_TOKEN     = process.env.API_TOKEN;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

const aiApp = require('apiai')(API_TOKEN);

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
            sendMessageWithApiAi(event);
            console.log(event);
          }
        });
      }
    });
    res.status(200).end();
  }
});

app.post('/ai', (req, res) => {
  if (req.body.result.action === 'weather') {
    let city = req.body.result.parameters['geo-city'];
    console.log(city);
    let restUrl = 'http://api.openweathermap.org/data/2.5/weather?APPID='+WEATHER_API_KEY+'&q='+city;
    request.get(restUrl, (err, response, body) => {
        if (!err && response.statusCode == 200) {
            let json = JSON.parse(body);
            let msg = json.weather[0].description + ' and the temperature is ' + json.main.temp + ' ℉';
            return res.json({
              speech: msg,
              displayText: msg,
              source: 'weather'});
          } else {
            return res.status(400).json({
              status: {
                code: 400,
                errorType: 'I failed to look up the city name.'}});
          }
    });
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

function sendMessageWithApiAi(event) {
  let sender = event.sender.id;
  let text = event.message.text;

  let apiai = aiApp.textRequest(text, {
    sessionId: process.env.VALID_TOKEN
  });

  apiai.on('response', (response) => {
    let aiText = response.result.fulfillment.speech;
    console.log("response ai %s ", aiText);
    request({
      url: 'https://graph.facebook.com/v2.10/me/messages',
      qs: {access_token: ACCESS_TOKEN},
      method: 'POST',
      json: {
          recipient: {id: sender},
          message: {text: aiText}
      }
    }, (error, response) => {
      if (error) {
          console.log('Error sending message: ', error);
      } else if (response.body.error) {
          console.log('Error: ', response.body.error);
      }
    });
  });

  apiai.on('error', (error) => {
    console.log(error);
  });

  apiai.end();
}
