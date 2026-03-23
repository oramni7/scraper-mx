const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");

const app = express();
app.use(cors());

const URL = "https://ligue-moto-centre.fr/motocross/";

app.get("/data", async (req, res) => {
  try {
    const { data } = await axios.get(URL);
    const $ = cheerio.load(data);

    const results = [];

    $("table tr").each((i, el) => {
      const tds = $(el).find("td");

      if (tds.length >= 4) {
        const pos = $(tds[0]).text().trim();
        const num = $(tds[1]).text().trim();
        const nom = $(tds[2]).text().trim();
        const ecart = $(tds[3]).text().trim();

        if (!isNaN(pos)) {
          results.push({ pos, num, nom, ecart });
        }
      }
    });

    res.json(results);

  } catch (err) {
    res.status(500).send("Erreur");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT);
