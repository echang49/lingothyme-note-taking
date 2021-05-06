const express = require('express')
const router  = express.Router();

//if meetings started, go to next phase.
// router.get('/userList', (req, res) => {
//     let { location } = req.params;
//     console.log(location);
//     console.log(req.body);
//     console.log(req.params);
//     console.log(req.query);

//     // let rawdata = fs.readFileSync('./config/rooms.json');
//     // let rooms = JSON.parse(rawdata);
//     //             if(rooms[code] == null){
//     //                 rooms[code] = { users: {} };
//     //                 fs.writeFileSync('config/rooms.json', JSON.stringify(rooms));
//     //             }
//     //             return res.send([true, room.phase]);
//     res.end();
// });
//

module.exports = router;