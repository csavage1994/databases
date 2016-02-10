var models = require('../models');
var Promise = require('bluebird');

/*

data = {result: [ {text: '', username:'',  } ]}


*/




module.exports = {
  messages: {
    get: function (req, res) {
      models.messages.get(function(result){
        console.log(result);
        res.json(result);
      });
      //console.log(messages._results);
      //res.end();
    }, // a function which handles a get request for all messages
    post: function (req, res) {
      var params = [req.body[text], req.body[userName], req.body[roomName]];
      models.messages.post(params, function(result){
        res.json(result);
      });
    } // a function which handles posting a message to the database
  },

  users: {
    // Ditto as above
    get: function (req, res) {
      models.users.get(function(result){
        res.json(result);
      })
    },
    post: function (req, res) {
      var params = [req.body[userName]];
      models.users.post(params, function(result){
        res.json(result);
      });
    }
  }
};

