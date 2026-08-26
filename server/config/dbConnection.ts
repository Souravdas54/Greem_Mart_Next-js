import dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config()

//details from the env
const username = process.env.DB_USERNAME
const password = process.env.DB_PASSWORD
const dbName = 'Green_Mart'

const mongodbUrl = `mongodb+srv://${username}:${password}@cluster0.ewwcraz.mongodb.net/${dbName}?retryWrites=true&w=majority&appName=Cluster0`

// Define ANSI color codes
const green = "\x1b[32m";
const red = "\x1b[31m";


//db connection
export const connectDatabase = async (): Promise<void> => {
    try {

        await mongoose.connect(mongodbUrl)
        console.log(`${green}Database connection succesfully ✔ to ${dbName}`)

    } catch (error) {
        console.error(`${red}MongoDB connection error. Please check your internet connection :`, error);
        setTimeout(connectDatabase, 5000);
    }
};

