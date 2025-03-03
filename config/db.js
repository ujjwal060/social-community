import mongoose from 'mongoose';
import {logger} from "../utils/logger.js"

const connectToDatabase = async (dbUri) => {
  try {
    console.log("dbUri",dbUri);

    await mongoose.connect(dbUri);
    logger.info('Connected to MongoDB successfully')
  } catch (error) {
    logger.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectToDatabase;