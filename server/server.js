
const express = require('express');
const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();
const service = require('./service');
const pacote = require('pacote');
var cors = require('cors')
const fileupload = require("express-fileupload");
const constants = require('./constants');



const basePath = constants.BASE_PATH + "/files/";

var allowlist = ['http://localhost:3000']
var corsOptionsDelegate = function (req, callback) {
  var corsOptions;
  if (allowlist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false } // disable CORS for this request
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
}
const BASE_URL = "/api/v1";

const app = express();
app.set('port', process.env.PORT || 3001);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(pino);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(fileupload());


app.get(`${BASE_URL}/files`, cors(corsOptionsDelegate), async (req, res) => {

  res.setHeader('Content-Type', 'application/json');
  try {
    const output = await service.getAllDocuments();
    res.send(output);
    return;
  } catch (err) {
    res.status(500).send(`Error${err}`);
    return;
  }
});


app.get(`${BASE_URL}/files/:user/:filename`, cors(corsOptionsDelegate), async (req, res) => {

  res.setHeader('Content-Type', 'application/json');
  try {
    if (!req.params['user']) {
      res.status(500).send("Invalid parameters");
      return;
    }
    else {
      const file = decodeURIComponent(req.params['filename']);
     

      res.download(basePath + req.params['user'] + "/" + file, file, (err) => {
        if (err) {
          res.status(500).send({
            message: "Could not download the file. " + err,
          });
        }
      });
    }
  } catch (err) {
    res.status(500).send(`Error${err}`);
    return;
  }
});


app.post(`${BASE_URL}/upload`, cors(corsOptionsDelegate), async (req, res) => {

  res.setHeader('Content-Type', 'application/json');
  const output = await service.saveFile(req, res);
});

app.listen(app.get('port'), () =>
  console.log('Express server is running on localhost:3001')
);
