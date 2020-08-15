const socketio = require('socket.io');
const moment = require('moment');

module.exports = (server) => {
    const io = socketio(server);
    io.on('connection', (socket) => {
        // socket.broadcast.emit('message', {
        //     time: moment().format('hh:mm:ss a'),
        //     id: 'ChatSock',
        //     msg: 'New User Joined ChatSock...'
        // });
        socket.emit('prevMsg', global.msgQueue);
        // socket.emit('message', {
        //     time: moment().format('hh:mm:ss a'),
        //     id: 'ChatSock',
        //     msg: 'Welcome to ChatSock chat service...'
        // });
        socket.on('msgEvent', (msgObj) => {
            msgObj['time'] = moment().valueOf();

            while (global.msgQueue.length > 9) {
                global.msgQueue.shift();
            }
            global.msgQueue.push(msgObj);
            io.emit('message', msgObj);
        });
    });
};