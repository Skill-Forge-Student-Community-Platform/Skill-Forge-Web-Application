import mongoose from 'mongoose';

const RegisteredUserSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    email: { type: String, required: true },
    eventId: { type: String, required: true },
    //points: { type: Number, required: false,default: 0  },
  });

  const RegisteredUser = mongoose.model('RegisteredUser', RegisteredUserSchema);

export default RegisteredUser;
