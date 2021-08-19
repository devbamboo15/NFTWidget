const express = require("express");
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.urlencoded());
app.use(express.json());

app.use(express.static(path.resolve(__dirname, '../client/build')));

app.post("/create-file", (req, res) => {
    const origin = req.get('origin');
    const time = Date.now();
    fs.writeFile(`server/json/${time}.json`, JSON.stringify(req.body), (err) => {
        if (err) return console.log(err);
    });
    res.json({ url: `${origin}meta?id=${time}` });
});

app.get("/meta", (req, res) => {
    console.log(req.query.id);
    const id = req.query.id;
    const content = fs.readFileSync(`server/json/${id}.json`, 'utf-8');
    console.log(content);
    res.json(JSON.parse(content));
});

// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
  });

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});