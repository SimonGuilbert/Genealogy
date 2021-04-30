const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use((req,res,next) => {
    res.json({message : 'requete recu'});
    next();
});

app.use(bodyParser.json());

app.post((req,res,next) => {
    console.log(req.body);
});

module.exports =app;