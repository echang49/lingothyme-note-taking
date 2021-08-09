//Room Schema
const mongoose = require('mongoose'); //mongoDB management

const MainhallRoomSchema = new mongoose.Schema({
    publicKey: {
        type: String,
        required: true
    },
    privateKey: {
        type: String,
        required: true
    },
    capacity: {
        type: Number,
        required: true
    },
    question: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    phase: {
        type: Number,
        required: true
    },
    brainstormList: {
        type: Array,
        required: false
    },
    paragraphList: {
        type: Array,
        required: false
    },

    createdBy: { // userName (or uid) of user that the room was created by
        type: String,
        required: false
    }


})

const MainhallRoom = mongoose.model('MainhallRoom', MainhallRoomSchema);

module.exports = MainhallRoom;