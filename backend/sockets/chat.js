const User = require('../models/User');
const Message = require('../models/Message');
const Room = require('../models/Room');

module.exports = (io) => {
  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('Authentication error'));
    try {
      const jwt = require('jsonwebtoken');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (!user) return next(new Error('User not found'));
      socket.user = user;
      next();
    } catch (err) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', async (socket) => {
    console.log(`✅ User connected: ${socket.user.name}`);
    await User.findByIdAndUpdate(socket.user._id, { online: true, lastSeen: new Date() });
    io.emit('user_status', { userId: socket.user._id, online: true });

    // Join personal room (for direct messages)
    socket.join(`user_${socket.user._id}`);

    // Join all group rooms the user participates in
    const rooms = await Room.find({ participants: socket.user._id });
    rooms.forEach(room => socket.join(room._id.toString()));

    // Handle sending a message
    socket.on('send_message', async (data) => {
      const { roomId, text, fileUrl, fileType } = data;
      const message = await Message.create({
        roomId,
        sender: socket.user._id,
        text,
        fileUrl,
        fileType,
        readBy: [socket.user._id]
      });
      const populated = await message.populate('sender', 'name email avatar');
      io.to(roomId.toString()).emit('new_message', populated);
    });

    // Handle typing indicator
    socket.on('typing', ({ roomId, isTyping }) => {
      socket.to(roomId).emit('user_typing', { userId: socket.user._id, name: socket.user.name, isTyping });
    });

    // Handle read receipts
    socket.on('mark_read', async ({ roomId, messageId }) => {
      await Message.findByIdAndUpdate(messageId, { $addToSet: { readBy: socket.user._id } });
      io.to(roomId).emit('message_read', { messageId, userId: socket.user._id });
    });

    // Handle disconnect
    socket.on('disconnect', async () => {
      await User.findByIdAndUpdate(socket.user._id, { online: false, lastSeen: new Date() });
      io.emit('user_status', { userId: socket.user._id, online: false });
      console.log(`❌ User disconnected: ${socket.user.name}`);
    });
  });
};