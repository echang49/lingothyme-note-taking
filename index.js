//require modules
const express = require('express'); //Backend framework

const path = require('path'); //Path points to different places
const dotenv = require('dotenv'); //dotenv is for storing session secrets
const connectDB = require('./config/db'); //file to connect to MongoDB Atlas
const fs = require('fs');
const cors = require('cors'); //cross origin resource sharing
const schedule = require('node-schedule'); //for cron jobs
const Room = require('./models/Rooms');
const puppeteer = require('puppeteer') //for creating the PDF
const sgMail = require('@sendgrid/mail'); //for sending email TWILIO SENDGRID API

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
      origin: process.env.SOCKET_ORIGIN,
      methods: ["GET", "POST"],
      credentials: true
    }
  }).listen(server); //socket.io over http for "live-editing"

//WEB SOCKET CREATED UPON NEW CONNECTION
io.on('connect', (socket) => {
    const ID = socket.id;
    
    socket.on('new-user', (location, name, callback) => {
        let room = location;
        socket.join(room);
        let rawdata = fs.readFileSync('./config/rooms.json');
        let rooms = JSON.parse(rawdata);
        if (!rooms[room]) rooms[room] = {users: {}};
        //tell new user who's already in
        socket.emit('connection', rooms[room].users);
        let ids = [1,2,3,4,5,6,7,8]
        let bool = true;
        //only unique ids left
        for(let i in rooms[room].users) {
            if (bool){ //if this is the first user
                io.to(i).emit('request-info', ID);
            }
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

    //User gives info to another user
    socket.on('resolve-info', (socketID, brainstormList, paragraphList) => {
        io.to(socketID).emit('resolve-info', [brainstormList, paragraphList]);
    });

    //A new brainstorm component was created
    socket.on('new-brainstorm', (room, userID, id) => {
        socket.broadcast.to(room).emit('new-brainstorm', [userID, id]);
    });

    //A new brainstorm component was created
    socket.on('edit-brainstorm', (room, data) => {
        socket.broadcast.to(room).emit('edit-brainstorm', data);
    });

    //A new paragraph component was created
    socket.on('new-paragraph', (room, id) => {
        socket.broadcast.to(room).emit('new-paragraph', id);
    });

    //A new paragraph component was created
    socket.on('edit-paragraph', (room, data) => {
        socket.broadcast.to(room).emit('edit-paragraph', data);
    });

    //Room phase has been changed by admin
    socket.on('phase-change', (room, phase, brainstormList, paragraphList) => {
        socket.broadcast.to(room).emit('phase-change', phase);
        Room.findOne({publicKey: room})
        .then(async (room) => {
            room.phase = phase;
            room.brainstormList = brainstormList;
            room.paragraphList = paragraphList;
            await room.save();
            if(phase === 4) { //if the meeting is finished, create PDF
                const browser = await puppeteer.launch({ headless: true });
                const page = await browser.newPage();
                await page.goto('https://www.lingothyme.com/pdf?id='.concat(room.publicKey), {waitUntil: 'networkidle0'});
                //await page.goto('http://localhost:3000/pdf?id=12345', {waitUntil: 'networkidle0'});
                let date = new Date();
                const pdf = await page.pdf({ 
                    format: 'A4', 
                    path: "./PDFS/".concat(date.toISOString().split('T')[0] + "-" + room.publicKey).concat(".pdf"),
                    margin: {
                        top: "20px",
                        bottom: "20px",
                        left: "20px",
                        right: "20px"
                    } 
                });
                await browser.close();

                const sgMail = require('@sendgrid/mail');
                sgMail.setApiKey(process.env.SENDGRID_API_KEY);

                const msg = {
                    to: room.email,
                    from: 'lingopal2020@gmail.com',
                    subject: 'Meeting Notes for ' + date.toISOString().split('T')[0] + "-" + room.publicKey,
                    html: '<p>Dear Admin, <br><br>' +
                        'Thanks for hosting your meeting on LingoThyme. Attached are the meeting notes from your prior meeting. Use them for internal record keeping or share them with other participants. <br><br>' +
                        'NOTE: This is an automated email that is sent to the admin after each meeting. <br><br>' +
                        'Sincerely,<br>' +
                        'The LingoThyme Team</p>',
                    attachments: [
                      {
                        content: Buffer.from(pdf).toString('base64'),
                        filename: "attachment.pdf",
                        type: "application/pdf",
                        disposition: "attachment"
                      }
                    ]
                };

                sgMail.send(msg).catch(err => {
                    console.log(err);
                });

                room.remove();
            }
        });
    });

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
    });
});