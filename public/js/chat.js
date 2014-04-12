$(function() {

    var socket = io.connect('http://localhost'),
        inputName = $('#inputName'),
        inputRoomName = $('#inputRoomName'),
        input = $('#input'),
        roomInput = $('#roomInput');;

    // Display a message
    function addMessage(from, text) {
        $('<li class="message"><span class="author">' + from + '</span>: ' + text + '</li>')
        .appendTo('#messages');
    }
    
    // Display a room message
    function addRoomMessage(from, text) {
        $('<li class="message"><span class="author">' + from + '</span>: ' + text + '</li>')
        .appendTo('#roomMessages');
    }

    // Display chat news
    function addAnnouncement(text) {
        $('<li class="announcement">' + text + '</li>')
        .appendTo('#messages');
    }

    // Handle the connect submit
    $('#connectForm').submit(function(event) {
        var name = inputName.val();

        event.preventDefault();
        socket.emit('join', name);

        // reset the input
        inputName.val('');
        $('#connect').addClass('hidden');
        $('#chat').removeClass('hidden');

    });
    
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
    $('#form').submit(function(event) {
        var msg = input.val();

        event.preventDefault();
        addMessage('Me', msg);
        socket.emit('text', msg);

        // reset the input
        input.val('');
        input.focus();
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