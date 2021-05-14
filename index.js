//require modules
const express = require('express'); //Backend framework

const path = require('path'); //Path points to different places
const dotenv = require('dotenv'); //dotenv is for storing session secrets
const connectDB = require('./config/db'); //file to connect to MongoDB Atlas
const fs = require('fs');
const cors = require('cors'); //cross origin resource sharing
const schedule = require('node-schedule'); //for cron jobs
const Room = require('./models/Rooms');

//Load config
dotenv.config({path: './config/config.env'});

//Connecting to the database
connectDB();

//Launch express
const app = express();

//CORS Middleware
app.use(cors());

app.use(express.static(path.join(__dirname, 'client/build'))); // Serve the static files from the React app
app.use(express.urlencoded({extended: true})); //Parse URL-encoded bodies
app.use(express.json()); //Used to parse JSON bodies

//ROUTES
app.use('/api/auth', require('./routes/authentication'));
app.use('/api/meet', require('./routes/meeting'));

// Handles any requests that don't match the ones above
app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

//Express app listens in on the following port
const port = process.env.PORT || 5000;
var server = app.listen(port);

console.log('App is listening on port ' + port);

//CRON JOB DONE EVERYDAY AT MIDNIGHT TO ENSURE ALL THE EXPIRED ROOMS ARE DELETED
const job = schedule.scheduleJob('0 0 * * *', () => {
    //get date as of right now. If this is older than the one posted, deleted the posted ones
    let date = Date.now();
    Room.find({} , (err, rooms) => {
        if(err) {
            console.log(err);
        }
        rooms.map(room => {
            if(date > room.date.getTime()) {
                Room.deleteOne({_id: room._id}, (err) => {
                    if(err) {
                        console.log(err);
                    }
                });
            }
        })
    })
});

var io = require('socket.io')(undefined, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true
    }
  }).listen(server); //socket.io over http for "live-editing"

//WEB SOCKET CREATED UPON NEW CONNECTION
io.on('connect', (socket) => {
    const ID = socket.id;
    
    socket.on('new-user', (location, name, callback) => {
        let room = location.split("?id=")[1];
        socket.join(room);
        let rawdata = fs.readFileSync('./config/rooms.json');
        let rooms = JSON.parse(rawdata);
        if (!rooms[room]) rooms[room] = {users: {}};
        //tell new user who's already in
        socket.emit('connection', rooms[room].users);
        let ids = [1,2,3,4,5,6,7,8]
        //only unique ids left
        for(let i in rooms[room].users) {
            ids.splice(ids.indexOf(rooms[room].users[i][1]),1);
        }
        rooms[room].users[ID] = [name, ids[0]];
        fs.writeFileSync('config/rooms.json', JSON.stringify(rooms));
        //emit to everyone in room that someone new is here
        io.to(room).emit('user-connected', [name, ids[0]]);
        callback({
            id: ids[0]
        });
    })

    // //disconnect the users from the room
    socket.on('disconnect', () => {
        let rawdata = fs.readFileSync('./config/rooms.json');
        let rooms = JSON.parse(rawdata);

        for(const room in rooms) {
            if (rooms[room].users[ID]) {
                io.to(room).emit('user-disconnected', rooms[room].users[ID]);
                delete rooms[room].users[ID];

                //if the room now has 0 users, delete room
                if(Object.keys(rooms[room].users).length === 0) {
                    delete rooms[room];
                }

                fs.writeFileSync('config/rooms.json', JSON.stringify(rooms));
                break;
            }
        }
    })

    // //emit message to all users in the chatroom
    // socket.on('send_chat_message', (room, message) => {
    //     io.in(room).emit('chat_message', { message: message, name: rooms[room].users[socket.id] });
    // })
});