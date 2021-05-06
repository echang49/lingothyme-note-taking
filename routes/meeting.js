const express = require('express')
const router  = express.Router();

//if meetings started, go to next phase.
router.get('/userList', (req, res) => {
    let rawdata = fs.readFileSync('./config/rooms.json');
    let rooms = JSON.parse(rawdata);
                if(rooms[code] == null){
                    rooms[code] = { users: {} };
                    fs.writeFileSync('config/rooms.json', JSON.stringify(rooms));
                }
                return res.send([true, room.phase]);
});
//

module.exports = router;