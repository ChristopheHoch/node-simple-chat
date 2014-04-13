$(function() {

    var socket = io.connect('http://localhost'),
        roomListMenu = $('#roomList').find('a'),
        inputRoomName = $('#inputRoomName'),
        roomInput = $('#roomInput');
    
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
    });
    
    // Send a message
    $('#sendMessageForm').submit(function(event) {
        var messageEl = $('#inputText'),
            message = messageEl.val();

        event.preventDefault();
        addMessage('Me', message);
        socket.emit('text', message);

        // Reset the message input
        messageEl.val('');
        messageEl.focus();
    });

    // Display a message
    function addMessage(author, message) {
        $('<li class="message"><strong>' + author + ':</strong> ' + message + '</li>')
        .appendTo('#messages');
    }
    
    // Display a room message
    function addRoomMessage(from, text) {
        $('<li class="message"><span class="author">' + from + '</span>: ' + text + '</li>')
        .appendTo('#roomMessages');
    }

    // Display chat news
    function addAnnouncement(text) {
        $('<li class="announcement"><em>' + text + '</em></li>')
        .appendTo('#messages');
    }
    
    // Handle the connect to room submit
    $('#connectRoomForm').submit(function(event) {
        var roomName = inputRoomName.val();

        event.preventDefault();
        socket.emit('joinRoom', roomName);

        // reset the input
        inputName.val('');
        $('#roomName').text(roomName);
        $('#roomMessages').empty();
        $('#connectRoom').addClass('hidden');
        $('#room').removeClass('hidden');

    });
    
    // Handle the form submit
    $('#roomForm').submit(function(event) {
        var msg = roomInput.val();

        event.preventDefault();
        addRoomMessage('Me', msg);
        socket.emit('roomMessage', msg);

        // reset the input
        roomInput.val('');
        roomInput.focus();
    });

    // Handle a new message
    socket.on('text', addMessage);
    
    // Handle new room message
    socket.on('roomMessage', addRoomMessage);

    // Handle disconnection
    socket.on('left', addAnnouncement);

    // Display any new connection
    socket.on('announcement', addAnnouncement);

});