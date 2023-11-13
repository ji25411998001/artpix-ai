const express = require("express");
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const axios = require('axios');
const CryptoJS = require("crypto-js");

const app = express();

app.use(cors());
app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({ extended: false }));
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));

app.get("/", (req, res) => {
  const filePath = path.resolve(__dirname, 'view/index.html');
  res.sendFile(filePath);
});

app.get("/text-to-image", (req, res) => {
  const filePath = path.resolve(__dirname, 'view/text-to-image.html');
  res.sendFile(filePath);
});

app.get("/image-to-image", (req, res) => {
  const filePath = path.resolve(__dirname, 'view/image-to-image.html');
  res.sendFile(filePath);
});

app.get("/remove-background", (req, res) => {
  const filePath = path.resolve(__dirname, 'view/remove-background.html');
  res.sendFile(filePath);
});

app.get("/upscale", (req, res) => {
  const filePath = path.resolve(__dirname, 'view/upscale.html');
  res.sendFile(filePath);
});

app.get("/unblur", (req, res) => {
  const filePath = path.resolve(__dirname, 'view/unblur.html');
  res.sendFile(filePath);
});

app.get("/blur-background", (req, res) => {
  const filePath = path.resolve(__dirname, 'view/blur-background.html');
  res.sendFile(filePath);
});

app.get("/colorizer", (req, res) => {
  const filePath = path.resolve(__dirname, 'view/colorizer.html');
  res.sendFile(filePath);
});

const api = require('./service/api');
app.use('/api', api);

app.get("/image/:key", async (req, res) => {
  const key = req.params.key;
  const decodedData = Buffer.from(key, 'base64').toString('utf-8');

  // Decrypt
  var bytes  = CryptoJS.AES.decrypt(decodedData, 'DC7B4D3A782B37EC');
  var originalText = bytes.toString(CryptoJS.enc.Utf8);

  try {
    const imageUrl = originalText;

    console.log(imageUrl)

    const response = await axios.get(imageUrl, { responseType: 'stream' });

    response.data.pipe(res);
  } catch (error) {
    console.error('Error fetching image:', error.message);
    res.status(500).send('Internal Server Error');
  }

});

app.listen(5000, () => {
  console.log("Running on port 5000!");
});
