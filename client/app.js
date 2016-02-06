
var clientApp;
$(function() {
  clientApp = {
//TODO: The current 'addFriend' function just adds the class 'friend'
//to all messages sent by the user
    server: 'http://127.0.0.1:3000/classes',
    username: 'anonymous',
    roomname: 'lobby',
    lastMessageId: 0,
    friends: {},

    init: function() {
      // Get username
      clientApp.username = window.location.search.substr(10);

      // Cache jQuery selectors
      clientApp.$main = $('#main');
      clientApp.$message = $('#message');
      clientApp.$chats = $('#chats');
      clientApp.$roomSelect = $('#roomSelect');
      clientApp.$send = $('#send');

      // Add listeners
      clientApp.$main.on('click', '.username', clientApp.addFriend);
      clientApp.$send.on('submit', clientApp.handleSubmit);
      clientApp.$roomSelect.on('change', clientApp.saveRoom);

      // Fetch previous messages
      /*

      uncomment later

      clientApp.startSpinner();



      */

      clientApp.fetch();

      // Poll for new messages
      setInterval(clientApp.fetch, 3000);
    },
    send: function(data) {


      //clientApp.startSpinner();


      // Clear messages input
      clientApp.$message.val('');

      // POST the message to the server
      $.ajax({
        url: clientApp.server,
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        success: function (data) {
          console.log('chatterbox: Message sent');
          // Trigger a fetch to update the messages, pass true to animate
          clientApp.fetch();
        },
        error: function (data) {
          console.error('chatterbox: Failed to send message');
        }
      });
    },
    fetch: function(animate) {
      $.ajax({
        url: clientApp.server,
        type: 'GET',
        contentType: 'application/json',
        data: {},
        success: function(data) {
          console.log('chatterbox: Messages fetched');
          data = JSON.parse(data);
          console.log(data.results);
          // Don't bother if we have nothing to work with
          if (!data.results || !data.results.length) { return; }

          // Get the last message
          var mostRecentMessage = data.results[data.results.length-1];
          var displayedRoom = $('.chat span').first().data('roomname');
          //clientApp.stopSpinner();
          // Only bother updating the DOM if we have a new message
          //if (mostRecentMessage.objectId !== clientApp.lastMessageId || clientApp.roomname !== displayedRoom) {
            // Update the UI with the fetched rooms
            clientApp.populateRooms(data.results);

            // Update the UI with the fetched messages
            clientApp.populateMessages(data.results, animate);

            // Store the ID of the most recent message
            clientApp.lastMessageId = mostRecentMessage.objectId;
          //}
        },
        error: function(data) {
          console.error('chatterbox: Failed to fetch messages');
        }
      });
    },
    clearMessages: function() {
      clientApp.$chats.html('');
    },
    populateMessages: function(results, animate) {
      // Clear existing messages

      clientApp.clearMessages();
      //clientApp.stopSpinner();
      if (Array.isArray(results)) {
        // Add all fetched messages
        results.forEach(clientApp.addMessage);
      }

      // Make it scroll to the bottom
      var scrollTop = clientApp.$chats.prop('scrollHeight');
      if (animate) {
        clientApp.$chats.animate({
          scrollTop: scrollTop
        });
      }
      else {
        clientApp.$chats.scrollTop(scrollTop);
      }
    },
    populateRooms: function(results) {
      clientApp.$roomSelect.html('<option value="__newRoom">New room...</option><option value="" selected>Lobby</option></select>');

      if (results) {
        var rooms = {};
        results.forEach(function(data) {
          var roomname = data.roomname;
          if (roomname && !rooms[roomname]) {
            // Add the room to the select menu
            clientApp.addRoom(roomname);

            // Store that we've added this room already
            rooms[roomname] = true;
          }
        });
      }

      // Select the menu option
      clientApp.$roomSelect.val(clientApp.roomname);
    },
    addRoom: function(roomname) {
      // Prevent XSS by escaping with DOM methods
      var $option = $('<option/>').val(roomname).text(roomname);

      // Add to select
      clientApp.$roomSelect.append($option);
    },
    addMessage: function(data) {
      if (!data.roomname)
        data.roomname = 'lobby';

      // Only add messages that are in our current room
      if (data.roomname === clientApp.roomname) {
        // Create a div to hold the chats
        var $chat = $('<div class="chat"/>');

        // Add in the message data using DOM methods to avoid XSS
        // Store the username in the element's data
        var $username = $('<span class="username"/>');
        $username.text(data.username+': ').attr('data-username', data.username).attr('data-roomname',data.roomname).appendTo($chat);

        // Add the friend class
        if (clientApp.friends[data.username] === true)
          $username.addClass('friend');

        var $message = $('<br><span/>');
        $message.text(data.text).appendTo($chat);

        // Add the message to the UI
        clientApp.$chats.append($chat);
      }
    },
    addFriend: function(evt) {
      var username = $(evt.currentTarget).attr('data-username');

      if (username !== undefined) {
        console.log('chatterbox: Adding %s as a friend', username);

        // Store as a friend
        clientApp.friends[username] = true;

        // Bold all previous messages
        // Escape the username in case it contains a quote
        var selector = '[data-username="'+username.replace(/"/g, '\\\"')+'"]';
        var $usernames = $(selector).addClass('friend');
      }
    },
    saveRoom: function(evt) {

      var selectIndex = clientApp.$roomSelect.prop('selectedIndex');
      // New room is always the first option
      if (selectIndex === 0) {
        var roomname = prompt('Enter room name');
        if (roomname) {
          // Set as the current room
          clientApp.roomname = roomname;

          // Add the room to the menu
          clientApp.addRoom(roomname);

          // Select the menu option
          clientApp.$roomSelect.val(roomname);

          // Fetch messages again
          clientApp.fetch();
        }
      }
      else {
        //clientApp.startSpinner();
        // Store as undefined for empty names
        clientApp.roomname = clientApp.$roomSelect.val();

        // Fetch messages again
        clientApp.fetch();
      }
    },
    handleSubmit: function(evt) {
      var message = {
        username: clientApp.username,
        text: clientApp.$message.val(),
        roomname: clientApp.roomname || 'lobby'
      };

      clientApp.send(message);

      // Stop the form from submitting
      evt.preventDefault();
    },
    /*startSpinner: function(){
      $('.spinner img').show();
      $('form input[type=submit]').attr('disabled', "true");
    },

    stopSpinner: function(){
      $('.spinner img').fadeOut('fast');
      $('form input[type=submit]').attr('disabled', null);
    }*/
  };

}());