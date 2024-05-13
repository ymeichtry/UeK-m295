const express = require('express');
const request = require('request');
const app = express();
const port = 3000;

app.get('/', (request, response) => {
    response.send('Write the zip into the url bar "localhost:300/temperature/{your zip}"');
  });

  app.get('/temperature/:plz', (req, res) => {
      const plz = req.params.plz;
      const url = `https://app-prod-ws.meteoswiss-app.ch/v1/plzDetail?plz=${plz}00`;
  
      request.get({
          url: url,
          json: true,
          headers: {'User-Agent': 'request'}
      }, (err, response, data) => {
          if (err) {
              console.log('Error:', err);
              res.status(500).send('Internal Server Error');
          } else if (response.statusCode !== 200) {
              console.log('Status:', response.statusCode);
              res.status(response.statusCode).send('Error (elseif)');
          } else {
              const temp = data.currentWeather.temperature;
              console.log("confirmed")
              res.send(`in your city you have ${temp} degrece`);
          }
      });
  });
  
  app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
  });
  