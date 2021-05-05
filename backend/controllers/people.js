const {PythonShell} = require('python-shell');

function insert(req, res) {
    //Here are the option object in which arguments can be passed for the python_test.js.
    let options = {
        mode: 'text',
        pythonOptions: ['-u'], // get print results in real-time
          //scriptPath: 'path/to/my/scripts', //If you are having python_test.py script in same folder, then it's optional.
        args: [req.body.name] //An argument which can be accessed in the script using sys.argv[1]
    };

    PythonShell.run('webScraping.py', options, function (err, result){
          if (err) throw err;
          // result is an array consisting of messages collected 
          //during execution of script.
          console.log('result: ', result.toString());
          res.status(200).json(result.toString())
          //res.send(result.toString())
    })
    /*
    .then((savedPizza) => {

        //send back the created Pizza
        res.json(savedPizza);
            
    }, (err) => {
        res.status(400).json(err)
    })*/;

}

function distinct(req, res) {

    let People = require("../models/people");

    People.find().distinct("name")
    .then((persons) => {
        res.status(200).json(persons);
    }, (err) => {
        res.status(500).json(err);
    });
 }

function read(req, res) {

    let People = require("../models/people");

    People.find({name : req.params.name})
    .then((person) => {
        res.status(200).json(person);
    }, (err) => {
        res.status(500).json(err);
    });
 }


module.exports.insert = insert;
module.exports.distinct = distinct;
module.exports.read = read;