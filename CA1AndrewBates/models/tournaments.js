let mongoose = require('mongoose');

let TournamentSchema = new mongoose.Schema({
        organizer: String,
        game: String,
        date: String,
        time: String,
        buyIn: Number,
        prize: Number,
        location: String,
        interested: {type: Number, default: 0},
        playerCount: {type: Number, default: 0},
        participants: [{name: String, username: String, nationality: String, team: String}]
    },
    { collection: 'tournamentsCol' });

module.exports = mongoose.model('Tournament', TournamentSchema);
