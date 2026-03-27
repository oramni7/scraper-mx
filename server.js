const express = require("express");
const puppeteer = require("puppeteer");
const cors = require("cors");

const app = express();
app.use(cors());

app.use(express.static("public"));

const URL = "https://ligue-moto-centre.fr/motocross/";

app.get("/data", async(req, res) => {
    try {
        const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
        const page = await browser.newPage();
        await page.goto(URL, { waitUntil: 'networkidle2' });

        const results = await page.evaluate(() => {
            const rows = document.querySelectorAll("table.c1-0 tr");
            const data = [];
            rows.forEach(row => {
                const tds = row.querySelectorAll("td");
                if (tds.length >= 6) {
                    const pos = tds[0].innerText.trim();
                    const num = tds[1].innerText.trim();
                    const nom = tds[2].innerText.trim();
                    const ecart = tds[4].innerText.trim();
                    const Mtemps = tds[6].innerText.trim();
                    if (pos && !isNaN(pos)) data.push({ pos, num, nom, ecart, Mtemps});
                }
            });
            return data;
        });

        await browser.close();
        res.json(results);
    } catch (error) {
        res.status(500).send("Erreur Puppeteer");
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running"));
