const express = require('express');
const app = express();

app.set("view engine", "ejs");
app.use(express.static(`${__dirname}/public`));

app.get('/', (req, res, next) => {
    res.render("main")
});

app.get('/school/day', (req, res, next) => {
    res.render("schooldaycalculator")
})

function addSocial(url, name) {
    app.get(`/socials/${name}`, (req, res, next) => {
        res.redirect(url);
    });
}

app.listen(5500);
module.exports = app;