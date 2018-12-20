let mongoose = require('mongoose');

let AccountSchema = new mongoose.Schema({
        name: String,
        nationality: String,
        email:String,
        username : String,
        password: String,
        team: String,
        matchesPlayed: {type: Number, default: 0},
        endorsement: {type: Number, default: 0},
        tournamentsPlayed: [{date: String, place: Number, name: String}],
        tournamentsOwned: [{name:String}],
        balance: {type: Number, default: 0},
    },
    { collection: 'accountsCol' });

module.exports = mongoose.model('Account', AccountSchema);