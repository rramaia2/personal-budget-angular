const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

app.use('/', express.static('public'));

const budgetData = JSON.parse(fs.readFileSync('budget-data.json', 'utf8'));

const budget =JSON.parse(fs.readFileSync('budget-data.json', 'utf8'));


app.get('/hello', (req, res) => {
    res.send('Hello World!');
});

app.get('/budget', (req, res) => {
    res.json(budget);
});
app.get('/budget-data', (req, res) => { // Change the route to /budget-data
    res.json(budgetData);
});

app.listen(port, () => {
console.log(`Example app listening at http://localhost:${port}`);
});