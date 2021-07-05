const fs = require('fs');
const express = require('express')
const router  = express.Router();
const Room = require('../models/Rooms');
const Profile = require('../models/profiles');
const MainhallRoom = require('../models/mainhall_rooms');

//utility function to make an ID
function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghjkmnopqrstuvwxyz0123456789'; // lower/upper case i and lower case L removed for clarity
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

//utility function to help /createRoom to make room
function makeRoom(publicKey, privateKey, email, number, question, date, res) {
    Room.findOne({publicKey: publicKey})
    .then(room => {
        if(room) {
            publicKey = makeid(5);
            makeRoom(publicKey, privateKey, email, number, question, date, res);
        }
        else {
            const newRoom = new Room({
                publicKey,
                privateKey,
                email,
                capacity: number,
                question,
                date,
                "phase": 1
            });
        
            newRoom.save().then().catch(err => console.log(err));
            
            res.send({publicKey, privateKey});
        }
    });
}

router.post('/createRoom', (req, res) => {
    let { email, number, question, date } = req.body;
    let publicKey = makeid(5);
    let privateKey = makeid(5);
    //If publicKey is taken, redo
    makeRoom(publicKey, privateKey, email, number, question, date, res);   
});


router.post('/enterRoom', (req, res) => {
    let { code } = req.body;
    let normalCode, adminCode;
    //if code has - go to admin half, if it doesn't continue on normal
    if(code.includes("-")) {
        code = code.split("-");
        normalCode = code[0];
        adminCode = code[1];
    }
    else {
        normalCode = code;
    }
    //if code not of proper length or it is an admin and that code is not of proper length.
    if((normalCode.length !== 5) || (adminCode !== undefined && adminCode.length !== 5)) {
        return res.send([false]);
    }
    //not an admin
    if(adminCode === undefined) {
        Room.findOne({publicKey: normalCode})
        .then(room => {
            if(room) {
                return res.send([true, false]);
            }
            else {
                return res.send([false]);
            }
        });
    }
    else {
        Room.findOne({publicKey: normalCode, privateKey: adminCode})
        .then(room => {
            if(room) {
                return res.send([true, true]);
            }
            else {
                return res.send([false]);
            }
        });
    }
});

router.post('/verifyUser', (req, res) => {
   let { location } = req.body;
   //split ?id=. if the result is length 5, look for the code.
   let code = location.split("?id=")[1];
   if(code !== undefined && code.length === 5) {
        Room.findOne({publicKey: code})
        .then(room => {
            if(room) {
                let rawdata = fs.readFileSync('./config/rooms.json');
                let rooms = JSON.parse(rawdata);
                if(rooms[code] == null){
                    rooms[code] = { users: {} };
                    fs.writeFileSync('config/rooms.json', JSON.stringify(rooms));
                }
                return res.send([true, room.phase, room.question]);
            }
            else {
                return res.send([false]);
            }
        });
   }
   else {
        return res.send([false]);
   }
});

router.post('/verifyAdmin', (req, res) => {
    let { location } = req.body;
    //split ?id=. if the result is length 5, look for the code.
    location = location.split("?id=")[1].split("-");
    let normalCode = location[0];
    let adminCode = location[1];
    if(normalCode !== undefined && normalCode.length === 5 && adminCode !== undefined && adminCode.length === 5) {
        Room.findOne({publicKey: normalCode, privateKey: adminCode})
        .then(room => {
            if(room) {
                let rawdata = fs.readFileSync('./config/rooms.json');
                let rooms = JSON.parse(rawdata);
                if(rooms[normalCode] == null){
                    rooms[normalCode] = { users: {} };
                    fs.writeFileSync('config/rooms.json', JSON.stringify(rooms));
                }
                return res.send([true, room.phase, room.question]);
            }
            else {
                return res.send([false]);
            }
        });
    }
    else {
         return res.send([false]);
    }
 });


// = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = MAIN HALL = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = // 

//utility function to make an ID
function mainhall_makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghjkmnopqrstuvwxyz0123456789'; // lower/upper case i and lower case L removed for clarity
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

//utility function to help /createRoom to make room
function mainhall_makeRoom(roomKey, number, question, date, res) {
    MainhallRoom.findOne({roomKey: roomKey})
    .then(room => {
        if(room) {
            roomKey = mainhall_makeid(7);
            mainhall_makeRoom(roomKey, number, question, date, res);
        }
        else {
            const newMainhallRoom = new MainhallRoom({
                roomKey,
                capacity: number,
                question,
                date,
                "phase": 1
            });
        
            newMainhallRoom.save().then().catch(err => console.log(err));
            res.send({roomKey});
        }
    });
}

 //utility function to help /createProfile to make profile
 function mainhall_makeProfile(email, username) {
    Profile.findOne({email: email})
    .then(profile => {
        if(profile) {
            alert("This profile already exists.");
        }
        else {
            let roomList = [];
            let aboutMe = "";
            const newProfile = new Profile({
                email,
                username,
                roomList,
                aboutMe
            });
            newProfile.save().then().catch(err => console.log(err));
        }
    });
}

function mainhall_editAboutMe(email, username, aboutMeText){
    Profile.findOne({email: email})
    .then(profile => {
        if(profile.aboutMe) {
            console.log("profile has an existing about me section, editing...")
            profile.update({email: email}, {$set : {aboutMe: aboutMeText}});
        }
        else {
            profile.update()
            newProfile.save().then().catch(err => console.log(err));
            res.send({aboutMe});
        }
    });
}

router.post('/mainhall_createProfile', (req, res) => {
    let { email, username } = req.body;
    mainhall_makeProfile(email, username);   
});

router.post('/mainhall_editAboutMe', (req, res) => {
    let { email, username, about_me } = req.body;
    editAboutMe(email, username, about_me);   
});

router.post('/mainhall_createRoom', (req, res) => {
    let { number, question, date } = req.body;
    let roomKey = mainhall_makeid(7);
    //If publicKey is taken, redo
    mainhall_makeRoom(roomKey, number, question, date, res);   
});


router.post('/mainhall_addRoom', (req, res) => { // add room to users list of rooms
    let { code } = req.body;
    let roomKey = code;
    //if code not of proper length 
    if(roomKey.length !== 7) {
        return res.send([false]);
    }
    Room.findOne({roomKey: roomKey})
    .then(room => {
        if(room) {
            return res.send([true, true]);
        }
        else {
            return res.send([false]);
        }
    });
    
});

router.post('/mainhall_joinRoom', (req, res) => { // join the room (send user to new url of room)
    let { code } = req.body;
    let roomKey = code;
    //if code not of proper length 
    if(roomKey.length !== 7) {
        return res.send([false]);
    }
    Room.findOne({roomKey: roomKey})
    .then(room => {
        if(room) {
            return res.send([true, true]);
        }
        else {
            return res.send([false]);
        }
    });
    
});

module.exports = router;