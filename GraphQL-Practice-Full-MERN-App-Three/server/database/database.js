import mongoose from "mongoose";

export const connectToDatabase = () => {
    mongoose
    .connect(process.env.MONGODB_URI, {
      dbName: "TaskManagerGraphQLDB",
    })
    .then(() => {
      console.log("Connected to Database");
    })
    .catch((err) => {
      console.log(`An error occurred while connection to database: ${err}`);
    });
};