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
function mainhall_makeRoom(publicKey, privateKey, number, question, date, createdBy, res) {
    MainhallRoom.findOne({publicKey: publicKey})
    .then(room => {
        if(room) {
            let publicKey = makeid(5);
            mainhall_makeRoom(publicKey, privateKey, number, question, date, createdBy, res);
        }
        else {
            const newMainhallRoom = new MainhallRoom({
                publicKey,
                privateKey,
                capacity: number,
                question,
                date,
                "phase": 1,
                createdBy
            });
        
            newMainhallRoom.save().then().catch(err => console.log(err));
            res.send({publicKey, privateKey});
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

function mainhall_editAboutMe(email, aboutMe){
    console.log("searching for profile: " + email + " for edit about me, with new text: " + aboutMe);
    Profile.findOne({email: email})
    .then(profile => {
        if(profile == null){
            console.log("profile is null");
        }else{ // profile is found
            if( profile.aboutMe !== null) {
                console.log("current about me text of this profile is: " + profile.aboutMe);
                profile.aboutMe = aboutMe; // set new about me section
                profile.save().then().catch(err => console.log(err)); // update about me section 
                console.log("new about me text of this profile is: " + profile.aboutMe);
                
            }
            else {
                console.log("profile.aboutMe is null."); 
            }
        }    
    });
}

function mainhall_edit_username(email, username){
    Profile.findOne({email: email})
    .then(profile => {
        if(profile == null){
            console.log("profile is null");
        }else{ // profile is found
            if( profile.username !== null) {
                console.log("current about me text of this profile is: " + profile.aboutMe);
                profile.username = username; // set new about me section
                profile.save().then().catch(err => console.log(err)); // update about me section 
                console.log("new username is: " + profile.username);
            }
            else {
                console.log("profile.aboutMe is null."); 
            }
        }    
    });
}

router.post('/mainhall_createProfile', (req, res) => {
    let { email, username } = req.body;
    mainhall_makeProfile(email, username);   
});

router.post('/mainhall_editAboutMe', (req, res) => {
    let { email, aboutMe } = req.body;
    mainhall_editAboutMe(email, aboutMe);   
    // set up useEffect hook so we can just run getAboutMe text again after edit
    //res.send({aboutMe});
    res.send(true);
});

router.post('/mainhall_edit_username', (req, res) => {
    let { email, username } = req.body;
    mainhall_edit_username(email, username);   
    // set up useEffect hook so we can just run getAboutMe text again after edit
    //res.send({aboutMe});
    res.send(true);
});



router.post('/mainhall_createRoom', (req, res) => {
    let { number, question, date, createdBy } = req.body;
    let publicKey = makeid(5);
    let privateKey = makeid(5);

    //If publicKey is taken, redo
    mainhall_makeRoom(publicKey, privateKey, number, question, date, createdBy, res);   
});


router.post('/mainhall_addRoom', (req, res) => { // add room to users list of rooms
    let { roomKey, email } = req.body; 
    MainhallRoom.findOne({publicKey: publicKey})
    .then(room => {
        if(room) { // roomKey found in mainHallRooms 
            Profile.findOne({email: email})
            .then(profile => {
                if(profile) {
                    // if roomKey does not already exist in users roomKeyList, push, else do not push
                    profile.roomList.indexOf(roomKey) === -1 ? profile.roomList.push(roomKey):console.log("This item already exists");
                    profile.save().then().catch(err => console.log(err));
                    roomKeyList = profile.roomKeyList;
                    return res.send(roomKeyList);
                }
                else {
                    console.log("profile not found, cannot insert");
                }
                console.log("Room has been added.")
                
            });    
        }else{ // roomKey not found
            console.log("incorrect room key, please try again");
        }
    });
    
});

// change to get request?
router.post('/mainhall_getRoomList',async (req, res) => { // get list of all rooms to display in main hall
    const roomList = [];
    const mainHallrooms = await MainhallRoom.find({})
    mainHallrooms.forEach(room =>{
        roomList.push(room)
        // console.log("hi")
    })
    return res.send(roomList);  
});

// change to get request?
router.post('/getAboutMeText', (req, res) => { // return user's about me section text
    let { email } = req.body;
    Profile.findOne({email: email})
    .then(profile => {
        if(profile) {
            //console.log("profile found, getting aboutMe text")
            aboutMe = profile.aboutMe;
            return res.send(aboutMe); // return about me text string for profile page render
        }
        else {
            console.log("profile not found - /getAboutMeText"); // TODO: res.send error
            //res.send()
        }
    });    
});

// change to get request?
router.post('/getUsername', (req, res) => { // return user's username
    let { email } = req.body;
    //console.log("finding username for email: " + email);
    Profile.findOne({email: email})
    .then(profile => {
        if(profile) {
            userName = profile.username;
            return res.send(userName); // return username for profile page render
        }
        else {
            console.log("profile not found - /getUsername"); // TODO: res.send error
            //res.send()
        }
    });    
});

// router.post('/mainhall_joinRoom', (req, res) => { // join the room (send user to new url of room)
//     let { publicKey, privateKey } = req.body;
//     let publicKey = publicKey;
//     let privateKey = privateKey
//     //if code not of proper length 
//     if(roomKey.length !== 7) {
//         return res.send([false]);
//     }
//     MainhallRoom.findOne({roomKey: roomKey})
//     .then(room => {
//         if(room) {
//             return res.send([true, true]);
//         }
//         else {
//             return res.send([false]);
//         }
//     });
    
// });

router.post('/mainhall_joinRoom', (req, res) => { // join the room (send user to new url of room)
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
        MainhallRoom.findOne({publicKey: normalCode})
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

router.post('/mainhall_joinRoom', (req, res) => { // join the room (send user to new url of room)
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
        MainhallRoom.findOne({publicKey: normalCode})
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
        MainhallRoom.findOne({publicKey: normalCode, privateKey: adminCode})
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

module.exports = router;