const express = require('express')
const router  = express.Router();
const Room = require('../models/Rooms');

//utility function to make an ID
function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
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
                date
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

module.exports = router;