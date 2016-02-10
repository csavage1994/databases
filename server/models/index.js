var db = require('../db');


db.connect(function(error){
  if(error){
    console.log('Error connecting to database');
  } else{
    console.log('Connection to database successful');
  }
});
/*
var getRoom = function(roomID, callback){
  db.query('select roomName from room where roomID = ?', roomID, function(err, result){
    if (err) {
      console.log('Error retrieving roomname.');
    } else {
      callback(result);
    }
  });
};

var getUser = function(userID, callback){
  db.query('select userName from user where userID = ?', userID, function(err, result){
    if (err) {
      console.log('Error retrieving username.');
    } else {
      callback(result);
    }
  });
};

[ RowDataPacket { messageText: 'hello', roomID: '20', userID: '15', messageID: 1 },

  RowDataPacket {
    messageText: 'hello2',
    roomID: '21',
    userID: '16',
    messageID: 2 } ]

roomID 20
roomID 21
[ { text: 'hello' }, { text: 'hello2' } ]
{ results: [ { text: 'hello' }, { text: 'hello2' } ] }
result [ RowDataPacket { roomName: 'testRoom' } ]
roomname [ RowDataPacket { roomName: 'testRoom' } ]
username []
result []
roomname []
username []



var reformatResults = function(data, callback){
  var reformatted = {
    results: []
  };
  for(var i = 0; i < data.length; i++){
    var temp = {
      text: data[i].messageText
    };

    getRoom(data[i].roomID, function(result){
      console.log(1);
      temp.roomname = result;
    });
    getUser(data[i].userID, function(result){
      temp.username = result;
    });

    reformatted.results.push(temp);
  }
  console.log('reformatted', reformatted);
  console.log(2);
  callback(reformatted);
}
*/


module.exports = {
  messages: {
    get: function (callBack) {
      //query db
      db.query('select messages.messageID as id, messages.messageText as text, user.userName as username, \
       room.roomName as roomname from messages, user, room', function(error, result){
        if(error){
          console.log('Request failed');
        } else {
            callBack(result);
        }
      });
      
    }, // a function which produces all the messages
    post: function (params, callBack) {
      //params = [text, username, roomname]
      db.query('insert into messages (messageText, userID, roomID) values (?, (select userID from user where userName = ?), \
                  (select roomID from room where roomName = ?))', params, function(err, results){
        if (err) {
          console.log('Message POST Error');
        } else {
          callBack(results);
        }
      });
    } // a function which can be used to insert a message into the database

  },

  users: {
    // Ditto as above.
    get: function (callback) {
      db.query('select * from user', function(error, results){
        if (error) {
          console.log('Users GET Error');
        } else {
          callback(results);
        }
      });
    },
    post: function (params, callback) {
      db.query('insert into user (userName) value (?)', params, function(error, result) {
        if (error) {
          console.log('Users POST Error');
        } else {
          callback(result);
        }
      });
    }
  }
};

