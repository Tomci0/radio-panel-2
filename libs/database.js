import { ConnectionCheckOutFailedEvent } from 'mongodb';
import mongoose from 'mongoose';

export const connect = () => {
    mongoose.connect(process.env.MONGODB_URI);
    
    mongoose.connection.on('connected', () => {
        console.log('Connected to MongoDB');
    });
    
    mongoose.connection.on('error', (err) => {
        console.log('Failed to connect to MongoDB', err);
    });
    
    mongoose.connection.on('disconnected', () => {
        console.log('Disconnected from MongoDB');
    });
}

export const disconnect = () => {
    mongoose.disconnect();
}