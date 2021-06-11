const express = require('express')
const router  = express.Router();
const Room = require('../models/Rooms');

//return meeting details in PDF Format
router.post('/pdf', (req, res) => {
    let { location } = req.body;
    if(location !== undefined && location.length === 5) {
        Room.findOne({publicKey: location})
        .then(room => {
            if(room) {
                return res.send([true, room.question, room.brainstormList, room.paragraphList]);
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

module.exports = router;