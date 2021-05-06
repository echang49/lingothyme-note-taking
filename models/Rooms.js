//Room Schema
const mongoose = require('mongoose'); //mongoDB management

const RoomSchema = new mongoose.Schema({
    publicKey: {
        type: String,
        required: true
    },
    privateKey: {
        type: String,
        required: true
    },
    email: {
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
    }
})

const Room = mongoose.model('Room', RoomSchema);

module.exports = Room;