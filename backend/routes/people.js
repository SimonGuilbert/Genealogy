const router = require('express').Router();

const controller = require('../controllers/people.js');

router.post("/insert", (req, res) => {

    controller.insert(req, res);

});

router.get("/distinct", (req, res) => {
    // SELECT DISTINCT NAME FROM PEOPLE
    // Pour la combobox
    controller.distinct(req, res);

});

router.get("/data/:name", (req, res) => {
    // SELECT * FROM PEOPLE WHERE NAME = name
    controller.read(req, res);

});

module.exports = router;