const fs = require('fs');
const express = require('express')
const router  = express.Router();

const Room = require('../models/Rooms');
const Profile = require('../models/profiles');
const MainhallRoom = require('../models/mainhall_rooms');

//twilio
const AccessToken = require('twilio').jwt.AccessToken;
const VoiceGrant = AccessToken.VoiceGrant;



const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
// const twilio = require('twilio');
const VoiceResponse = require('twilio').twiml.VoiceResponse;

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

router.post('/mainhall_joinRoom', (req, res) => { // join the room (send user to new url of room)
    let { publicKey, privateKey, createdBy, currentUserEmail } = req.body;
    //if code has - go to admin half, if it doesn't continue on normal
    let normalCode = publicKey;
    let adminCode = publicKey.concat(privateKey);
    //if code not of proper length or it is an admin and that code is not of proper length.
    if((normalCode.length !== 5) || (adminCode !== undefined && adminCode.length !== 10)) {
        console.log("code not of proper length");
        return res.send([false]);
    }

    if(createdBy == currentUserEmail) { // current user is admin, return admin view
        MainhallRoom.findOne({publicKey: normalCode})
        .then(room => {
            let currentDate = new Date();
            if(room) {
                if(room.date > currentDate.getDate()){ // if roomDate !== currentDate send false
                    return res.send([true, false, false]);
                }
                else{
                    return res.send([true, false, true]); // room is today, allow user to join
                }  
            }
            else {
                console.log("searched with public key, room not found");
                return res.send([false]);
            }
        });
    }
    else { // current user is not admin, return user view
        MainhallRoom.findOne({publicKey: normalCode, privateKey: privateKey})
        .then(room => {
            let currentDate = new Date();
            if(room) {
                if(room.date > currentDate.getDate()){ // if roomDate !== currentDate send false
                    return res.send([true, true, false]); // room is not today, do not allow user to join
                }
                else{
                    return res.send([true, true, true]); // room is today, allow user to join
                }  
            }
            else {
                console.log("searched with public and private keys, room not found");
                return res.send([false]);
            }
        });
    }
});

router.post('/mainhall_verifyUser', (req, res) => {
    let { location } = req.body;
    //split ?id=. if the result is length 5, look for the code.
    let code = location.split("?id=")[1];
    if(code !== undefined && code.length === 5) {
         MainhallRoom.findOne({publicKey: code})
         .then(room => {
             if(room) {
                 let rawdata = fs.readFileSync('./config/mainhall_rooms.json');
                 let rooms = JSON.parse(rawdata);
                 if(rooms[code] == null){
                     rooms[code] = { users: {} };
                     fs.writeFileSync('config/mainhall_rooms.json', JSON.stringify(rooms));
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
 
 router.post('/mainhall_verifyAdmin', (req, res) => {
     let { location } = req.body;
     //split ?id=. if the result is length 5, look for the code.
     location = location.split("?id=")[1].split("-");
     let normalCode = location[0];
     let adminCode = location[1];
     if(normalCode !== undefined && normalCode.length === 5 && adminCode !== undefined && adminCode.length === 5) {
        MainhallRoom.findOne({publicKey: normalCode, privateKey: adminCode})
         .then(room => {
             if(room) {
                 let rawdata = fs.readFileSync('./config/mainhall_rooms.json');
                 let rooms = JSON.parse(rawdata);
                 if(rooms[normalCode] == null){
                     rooms[normalCode] = { users: {} };
                     fs.writeFileSync('config/mainhall_rooms.json', JSON.stringify(rooms));
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

// twilio voice

router.post('/generate_token', (req, res) => {
    const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioApiKey = process.env.TWILIO_API_KEY;
    const twilioApiSecret = process.env.TWILIO_API_SECRET;
    const outgoingApplicationSid = process.env.TWILIO_TWIML_APP_SID;
    let { identity } = req.body;

    //const identity = 'user';

    const voiceGrant = new VoiceGrant({
        outgoingApplicationSid: outgoingApplicationSid,
        incomingAllow: true, // Optional: add to allow incoming calls
    });

    const token = new AccessToken(
        twilioAccountSid,
        twilioApiKey,
        twilioApiSecret,
        {identity: identity}
    );
    token.addGrant(voiceGrant);
    // Serialize the token to a JWT string

    const tokenJWT = token.toJwt();
    console.log("tokenJWT: " + tokenJWT);
    res.send(tokenJWT);
});

// Create a route that will handle Twilio webhook requests, sent as an
// HTTP POST to /voice in our application
router.post('/voice', (req, res) => {
    let { from } = req.body;

    // Use the Twilio Node.js SDK to build an XML response
    const response = new VoiceResponse();
    console.log("playing message before starting conference");
    response.say({
        voice: 'man',
        language: 'en'
    }, 'Test message!');
    //response.say('Starting conference.');

    // Start with a <Dial> verb
    const dial = response.dial();
    // If the caller is our MODERATOR, then start the conference when they
    // join and end the conference when they leave
    if (from == 'fromModerator') {
        console.log("Joining conference call as moderator");

        dial.conference('Room1', {
            maxParticipants: 8,
            startConferenceOnEnter: true,
            endConferenceOnExit: true,
            muted: false, // false for testing purposes, change to true later
            //waitURL: '', // this will disable music while waiting for call start
            // while waitURL is not set, copyright free music will play until 2 people join call
        });
        console.log("response.toString: " + response.toString());
    } else {
      // Otherwise have the caller join as a regular user
        console.log("Joining conference call as user");
        dial.conference('Room conference', {
        maxParticipants: 8,
        startConferenceOnEnter: false,
        muted: true,
        //waitURL: '', // this will disable music while waiting for call start
        // while waitURL is not set, copyright free music will play until 2 people join call
      });
      console.log("response.toString: " + response.toString());
    }
  
    // Render the response as XML in reply to the webhook request
    res.type('text/xml');
    res.send(response.toString());
});

module.exports = router;