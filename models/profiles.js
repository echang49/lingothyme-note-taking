//Profile Schema
const mongoose = require('mongoose'); //mongoDB management

const ProfileSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },

    username:{
        type: String,
        required: true
    },
    roomList:{ // array of all rooms the user is in, used for displaying rooms in mainhall
        type: Array, 
        required: true
    },

    aboutMe:{
        type: String, 
        required: false
    }

})

const Profile = mongoose.model('Profile', ProfileSchema);

module.exports = Profile;