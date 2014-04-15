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
            activeRoom = $('#roomListDropdown').find('.active').find('a')[0];

        event.preventDefault();
        addMessage('Me', message, activeRoom.id);
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

        changeRoom(roomName);
    });

    // Display a message
    function addMessage(author, message, room) {
        // If a room is defined then display on the correct room.
        // Otherwise display the message on the main room.
        var newMessage = $('<p class="message"><strong>' + author + ':</strong> ' + message + '</p>'),
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

        $('#roomListDropdown').find('#' + room).click(function(event) {
            var roomName = this.id;

            event.preventDefault();

            changeRoom(roomName);
        });

        $('<div id="messages_' + room + '"></div>')
        .appendTo('#messages');
    }

    // Change the active room
    function changeRoom(room) {
        var roomList = $('#roomListDropdown'),
            activeRoom = roomList.find('.active'),
            activeRoomName = activeRoom.find('a')[0].id,
            newActiveRoom = roomList.find('#' + room).parent(),
            messages = $('#messages'),
            activeRoomMessages = messages.find('#messages_' + activeRoomName),
            newActiveRoomMessages = messages.find('#messages_' + room);

        if(newActiveRoom) {
            newActiveRoom.addClass('active');
            if(newActiveRoomMessages) {
                newActiveRoomMessages.removeClass('hidden');
            }
        }
        if(activeRoom) {
            activeRoom.removeClass('active');
            if(activeRoomMessages) {
                activeRoomMessages.addClass('hidden');
            }
        }
    }
    
    // Display chat news
    function addAnnouncement(text, room) {
        var newAnnouncement = $('<p class="announcement"><em>' + text + '</em></p>');
        if(room) {
            newAnnouncement.appendTo('#messages_' + room);
        } else {
            newAnnouncement.appendTo('#messages_main');
        }
    }

    // Handle a new message
    socket.on('text', addMessage);

    // Handle disconnection
    socket.on('left', addAnnouncement);

    // Display any new connection
    socket.on('announcement', addAnnouncement);
    
    // Display any new connection on a room
    socket.on('roomAnnouncement', addAnnouncement);

});