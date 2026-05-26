require('dotenv').config();
const mongoose = require('mongoose');
const Room = require('./models/Room');

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  await Room.deleteMany({});
  const general = await Room.create({ name: 'General', type: 'group', participants: [] });
  console.log('Room created:', general.name);
  process.exit();
};
seed();