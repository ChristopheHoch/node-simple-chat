/* global $, io */

$(function() {
    "use strict";

    var socket = io.connect('http://localhost'),
        roomListMenu = $('#roomList a');
    
    // Join the chat
    $('#joinChatForm').submit(function(event) {
        var nicknameEl = $('#nicknameField'),
            nickname = nicknameEl.val();

        event.preventDefault();
        socket.emit('join', nickname);

        // Reset the input
        nicknameEl.val('');
        // Hide the nickname input
        $('#joinChatForm').addClass('hidden');
        // Show the chat
        $('#chat').removeClass('hidden');
        roomListMenu.removeClass('hidden');
        // Display the nickname of the user
        $('#nickname').text(nickname);
        $('#nickname').removeClass('hidden');
        $('#joinChatRoomForm').removeClass('hidden');
    });
    
    // Send a message
    $('#sendMessageForm').submit(function(event) {
        var messageEl = $('#inputText'),
            message = messageEl.val(),
            activeRoom = $('#roomListDropdown').find('.active');

        event.preventDefault();
        addMessage('Me', message);
        socket.emit('text', message, activeRoom.id);

        // Reset the message input
        messageEl.val('');
        messageEl.focus();
    });
    
    // Join a new room
    $('#joinChatRoomForm').submit(function(event) {
        var roomEl = $('#roomField'),
            room = roomEl.val();

        event.preventDefault();
        socket.emit('joinRoom', room);

        // Reset the input
        roomEl.val('');
        addNewRoom(room);
    });
    
    $('#roomListDropdown').find('a').click(function(event) {
        var roomName = this.id;
        
        event.preventDefault();
        
        changeRoom(roomName)
    });

    // Display a message
    function addMessage(author, message, room) {
        // If a room is defined then display on the correct room.
        // Otherwise display the message on the main room.
        var newMessage = $('<li class="message"><strong>' + author + ':</strong> ' + message + '</li>'),
            roomName,
            roomEl;
        if(room) {
            roomName = '#messages_' + room;
            roomEl = $(roomName);
            if(roomEl) {
                newMessage.appendTo(roomEl);
            }
        } else {
            newMessage.appendTo('#messages_main');
        }
        
    }
    
     // Display a new room
    function addNewRoom(room) {
        $('<li><a href="#" id="' + room + '">' + room + '</a></li>')
        .appendTo('#roomListDropdown');
        
        $('<ul id="messages_' + room + '"></ul>')
        .appendTo('#messages');
    }
    
     // Change the active room
    function changeRoom(room) {
        var roomList = $('#roomListDropdown'),
            activeRoom = roomList.find('.active'),
            newActiveRoom = roomList.find('#room');
        
        if(newActiveRoom) {
            newActiveRoom.addClass('active');
        }
        if(activeRoom) {
            activeRoom.removeClass('active');
        }
    }

    // Display chat news
    function addAnnouncement(text) {
        $('<li class="announcement"><em>' + text + '</em></li>')
        .appendTo('#messages');
    }

    // Handle a new message
    socket.on('text', addMessage);

    // Handle disconnection
    socket.on('left', addAnnouncement);

    // Display any new connection
    socket.on('announcement', addAnnouncement);

});