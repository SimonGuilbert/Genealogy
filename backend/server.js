const express = require('express');

const mongoose = require('mongoose');

//to access form data
let bodyParser = require('body-parser');

//The 404 middleware used when an incoming request
//hits a wrong route
const http404 = require('./middleware/route404');

//Create an application 
const app = express();

var cors = require('cors')

app.use(cors())

//used to fetch the data from forms on HTTP POST, and PUT
app.use(bodyParser.urlencoded({
    extended : true
  }));
  
app.use(bodyParser.json());

//Connecting to MongoDB (async/await approach)
const connectDb = async () => {
    await mongoose.connect('mongodb://localhost:27017/genealogy', {useNewUrlParser: true, useUnifiedTopology : true}).then(
        () => {
            console.log(`Connected to database`)
        },
        error => {
            console.error(`Connection error: ${error.stack}`)
            process.exit(1)
        }
    )
  }
  
  connectDb().catch(error => console.error(error))

//Accessing the routes
const peopleRoutes = require('./routes/people');

//Acces the routes
app.use('/api/v1/', peopleRoutes);

//When there is no route that caught the incoming request
//use the 404 middleware
app.use(http404.notFound);

//Listen on the port 3001
app.listen(3001, () => {
    console.log('Server is running on port: 3001');
});