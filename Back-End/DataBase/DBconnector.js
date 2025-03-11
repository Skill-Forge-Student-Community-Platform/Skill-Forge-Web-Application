import mongoose from "mongoose"

export const connectDB = async () => {
  try {
    console.log("mongo uri: ", process.env.MONGO_URI);
    const connection = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    console.log("Error connecting to MongoDB ", error.message);
    process.exit(1);  // failure to connect to MongoDB , exiting
  }
}
