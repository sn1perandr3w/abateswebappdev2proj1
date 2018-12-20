let Account = require('../models/accounts');
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

//Adds account to DB

router.addAccount = (req, res) => {

    res.setHeader('Content-Type', 'application/json');

    var account = new Account();

    account.name= req.body.name;
    account.nationality= req.body.nationality;
    account.email= req.body.email;
    account.username= req.body.username;
    account.password= req.body.password;
    account.team= req.body.team;

    account.save(function(err) {
        if (err)
            res.json({ message: 'Account NOT Added!', errmsg : err } );
        else
            res.json({ message: 'Account Successfully Added!', data: account });
    });
}

//Finds single account on DB

router.findOne = (req, res) => {

    res.setHeader('Content-Type', 'application/json');

    Account.find({ "username" : req.params.username },function(err, account) {
        if (err)
            res.json({ message: 'Account NOT Found!', errmsg : err } );
        else
            res.send(JSON.stringify(account,null,5));
    });
}

//Finds All Accounts in DB

router.findAll = (req, res) => {
    // Return a JSON representation of our list
    res.setHeader('Content-Type', 'application/json');

    Account.find(function(err, accounts) {
        if (err)
            res.send(err);

        res.send(JSON.stringify(accounts,null,5));
    });
}

//Deletes single account on DB

router.deleteAccount = (req, res) => {

    Account.findByIdAndRemove(req.params.id, function(err) {
        if (err)
            res.json({ message: 'Account NOT DELETED!', errmsg : err } );
        else
            res.json({ message: 'Account Successfully Deleted!'});
    });
}

//Used to allow an account to be endorsed for good sportsmanship or other criteria.

router.incrementEndorsement = (req, res) => {

    Account.findById(req.params.id, function(err,account) {
        if (err)
            res.json({ message: 'Account NOT Found!', errmsg : err } );
        else {
            account.endorsement += 1;
            account.save(function (err) {
                if (err)
                    res.json({ message: 'Account NOT interested!', errmsg : err } );
                else
                    res.json({ message: 'Account Successfully interested!', data: account});
            });
        }
    });
}

//Adds money to the balance of the account.

router.incrementBalance = (req, res) => {

    Account.findById(req.params.id, function(err,account) {
        if (err)
            res.json({ message: 'Account NOT Found!', errmsg : err } );
        else {

            addition = new Number(req.params.addition);
            account.balance += addition;
            account.save(function (err) {
                if (err)
                    res.json({ message: 'Balance NOT added to account!', errmsg : err } );
                else
                    res.json({ message: 'Balance added to account!', data: account});
            });
        }
    });
}

//Removes money from the balance of the account

router.decrementBalance = (req, res) => {

    Account.findById(req.params.id, function(err,account) {
        if (err)
            res.json({ message: 'Account NOT Found!', errmsg : err } );
        else {

            subtraction = new Number(req.params.subtraction);
            account.balance -= subtraction;
            account.save(function (err) {
                if (err)
                    res.json({ message: 'Subtraction NOT removed from account!', errmsg : err } );
                else
                    res.json({ message: 'Subtraction removed from account!', data: account});
            });
        }
    });
}




module.exports = router;
