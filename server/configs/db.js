import mongoose from 'mongoose';

const connectDB = async () => {
    const DBString = process.env.MONGODB_URI.replace("<db_password>", process.env.MONGODB_PASSWORD);

    try {
     mongoose.connection.on('connected', () => console.log('DB connected'));
     await mongoose.connect(`${DBString}/greencart`); 
    } catch(error) {
console.log(error.message);
    }
}

export default connectDB;