//require modules
const express = require('express'); //Backend framework
const path = require('path'); //Path points to different places
const bodyParser = require('body-parser'); //body-parser parses incoming data into JSON or URL-ENCODED data
const dotenv = require('dotenv'); //dotenv is for storing session secrets
const connectDB = require('./config/db'); //file to connect to MongoDB Atlas
const fs = require('fs');
const http = require('http').Server(express); //nodejs http dependency
const io = require('socket.io')(http); //socket.io over http for "live-editing"
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
app.listen(port);

console.log('App is listening on port ' + port);

//CRON JOB DONE EVERYDAY AT MIDNIGHT TO ENSURE ALL THE EXPIRED ROOMS ARE DELETED
const job = schedule.scheduleJob('0 0 * * *', () => {
    //get date as of right now. If this is older than the one posted, deleted the posted ones
    let date = Date.now();
    console.log(date);
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

//WEB SOCKET CREATED UPON NEW CONNECTION
io.sockets.on('connection', (socket) => {
    socket.on('new-user', (room, name) => {
        socket.join(room);
        let rawdata = fs.readFileSync('./config/rooms.json');
        let rooms = JSON.parse(rawdata);
        if (!rooms[room]) rooms[room] = {users: {}};
        let ids = [1,2,3,4,5,6,7,8]
        //only unique ids left
        for(let i of rooms[room].users) {
            ids.splice(ids.indexOf(i[1]),1);
        }
        rooms[room].users[socket.id] = [name, ids[0]];
        fs.writeFileSync('config/rooms.json', JSON.stringify(rooms));
        socket.to(room).broadcast.emit('user-connected', [name, id]);
    })

    // //disconnect the users from the room
    // socket.on('disconnect', () => {
    //     for(const room in rooms) {
    //         if (rooms[room].users[socket.id]) {
    //             const name = rooms[room].users[socket.id];
    //             socket.to(room).broadcast.emit('user-disconnected', name + ' has left the chatroom');
    //             delete rooms[room].users[socket.id];
                
    //             //if the room now has 0 users, delete room
    //             if(Object.keys(rooms[room].users).length === 0) {
    //                 delete rooms[room];
    //                 console.log("ROOM HAS BEEN DELETED");
    //             }
    //         }
    //     }
    // })

    // //emit message to all users in the chatroom
    // socket.on('send_chat_message', (room, message) => {
    //     io.in(room).emit('chat_message', { message: message, name: rooms[room].users[socket.id] });
    // })
});