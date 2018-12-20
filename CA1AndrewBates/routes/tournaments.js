let Tournament = require('../models/tournaments');
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let uriUtil = require('mongodb-uri');

var mongodbUri ='mongodb://abdbaccess:w1tw1tw1t@ds135413.mlab.com:35413/tournamentsdb';

mongoose.connect(mongodbUri);

//mongoose.connect('mongodb://localhost:27017/tournamentsdb');

let db = mongoose.connection;

db.on('error', function (err) {
    console.log('Unable to Connect to [ ' + db.name + ' ]', err);
});

db.once('open', function () {
    console.log('Successfully Connected to [ ' + db.name + ' ]');
});

//Finds all tournaments in DB

router.findAll = (req, res) => {
    // Return a JSON representation of our list
    res.setHeader('Content-Type', 'application/json');

    Tournament.find(function(err, tournaments) {
        if (err)
            res.send(err);

        res.send(JSON.stringify(tournaments,null,5));
    });
}

//Finds a single tournament in DB

router.findOne = (req, res) => {

    res.setHeader('Content-Type', 'application/json');

    Tournament.find({ "_id" : req.params.id },function(err, tournament) {
        if (err)
            res.json({ message: 'Tournament NOT Found!', errmsg : err } );
        else
            res.send(JSON.stringify(tournament,null,5));
    });
}


//Finds All Participants in tournament

router.findParticipants = (req, res) => {
    Tournament.findById(req.params.id, function(err,tournament) {
        if (err)
            res.json({ message: 'Tournament NOT Found!', errmsg : err } );
        else {
        }
        let name = tournament.participants;
        res.send(JSON.stringify(name,null,5));
    })
}


//Adds a new tournament to DB

router.addTournament = (req, res) => {

    res.setHeader('Content-Type', 'application/json');

    var tournament = new Tournament();

    tournament.organizer= req.body.organizer;
    tournament.game= req.body.game;
    tournament.date= req.body.date;
    tournament.time= req.body.time;
    tournament.buyIn= req.body.buyIn;
    tournament.prize= req.body.prize;
    tournament.location= req.body.location;

    tournament.save(function(err) {
        if (err)
            res.json({ message: 'Tournament NOT Added!', errmsg : err } );
        else
            res.json({ message: 'Tournament Successfully Added!', data: tournament });
    });
}

//Adds a participant to a tournament

router.addParticipant = (req, res) => {
    Tournament.findById(req.params.id, function(err,tournament) {
        if (err)
            res.json({ message: 'Tournament NOT Found!', errmsg : err } );
        else {
        }
            var participant = {"name":req.body.name, "username":req.body.username, "nationality": req.body.nationality,"team": req.body.team};
            tournament.playerCount += 1;
            tournament.participants.push(participant);
            tournament.save(function (err) {
                if (err)
                    res.json({ message: 'Participant not added to tournament!', errmsg : err } );
                else
                    res.json({ message: 'Participant added!', data: tournament});
            });
    })
}

//Removes a participant from a tournament

router.removeParticipant = (req, res) => {
    Tournament.findById(req.params.id, function(err,tournament) {
        if (err)
            res.json({ message: 'Tournament NOT Found!', errmsg : err } );
        else {
        }

        tournament.playerCount -= 1;
        tournament.participants.id(req.params.pid).remove();
        tournament.save(function (err) {
            if (err)
                res.json({ message: 'Participant not removed from tournament!', errmsg : err } );
            else
                res.json({ message: 'Participant removed!', data: tournament.participants});
        });
    })
}

//Deletes a tournament

router.deleteTournament = (req, res) => {

    Tournament.findByIdAndRemove(req.params.id, function(err) {
        if (err)
            res.json({ message: 'Tournament NOT DELETED!', errmsg : err } );
        else
            res.json({ message: 'Tournament Successfully Deleted!'});
    });
}

//Increments a counter for those interested in the tournament.

router.incrementInterest = (req, res) => {

    Tournament.findById(req.params.id, function(err,tournament) {
        if (err)
            res.json({ message: 'Tournament NOT Found!', errmsg : err } );
        else {
            tournament.interested += 1;
            tournament.save(function (err) {
                if (err)
                    res.json({ message: 'Tournament NOT interested!', errmsg : err } );
                else
                    res.json({ message: 'Tournament Successfully interested!', data: tournament});
            });
        }
    });
}

//Decrements a counter for those interested in the tournament.

router.decrementInterest = (req, res) => {

    Tournament.findById(req.params.id, function(err,tournament) {
        if (err)
            res.json({ message: 'Tournament NOT Found!', errmsg : err } );
        else {
            tournament.interested -= 1;
            tournament.save(function (err) {
                if (err)
                    res.json({ message: 'Tournament NOT deinterested!', errmsg : err } );
                else
                    res.json({ message: 'Tournament Successfully deinterested!', data: tournament});
            });
        }
    });
}

//Gets the value of the interest of a tournament

router.findInterest = (req, res) => {

    Tournament.findById(req.params.id, function(err,tournament) {
        if (err)
            res.json({ message: 'Tournament NOT Found!', errmsg : err } );
        else {
            res.json({ totalinterest : tournament.interested });
        }


    });
}

module.exports = router;
