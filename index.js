//require modules
const express = require('express'); //Backend framework
const path = require('path'); //Path points to different places
const bodyParser = require('body-parser'); //body-parser parses incoming data into JSON or URL-ENCODED data
const dotenv = require('dotenv'); //dotenv is for storing session secrets
const connectDB = require('./config/db'); //file to connect to MongoDB Atlas
const cors = require('cors'); //cross origin resource sharing


//Load config
dotenv.config({path: './config/config.env'});

//Connecting to the database
connectDB();

//Launch express
const app = express();

//CORS Middleware
app.use(cors());

app.use(express.static(path.join(__dirname, 'client/build'))); // Serve the static files from the React app
app.use(bodyParser.json()); //BODY PARSER: SUPPORTS JSON ENCODED BODIES
app.use(bodyParser.urlencoded({extended: true}));//BODY PARSER: SUPPORTS URL-ENCODED BODIES

//ROUTES
app.use('/api/auth', require('./routes/authentication'));

// Handles any requests that don't match the ones above
app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

//Express app listens in on the following port
const port = process.env.PORT || 5000;
app.listen(port);

console.log('App is listening on port ' + port);