//Room Schema
const mongoose = require('mongoose'); //mongoDB management

const MainhallRoomSchema = new mongoose.Schema({
    roomKey: {
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
    }
})

const MainhallRoom = mongoose.model('MainhallRoom', MainhallRoomSchema);

module.exports = MainhallRoom;