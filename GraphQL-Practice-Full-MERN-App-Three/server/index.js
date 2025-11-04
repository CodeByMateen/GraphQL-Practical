import express from "express";
import { graphqlHTTP } from "express-graphql";
import { schema } from './schema/schema.js';
import dotenv from "dotenv";
import { connectToDatabase } from './database/database.js';
import cors from "cors";

dotenv.config();
const app = express();

// Enable CORS for all routes
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

connectToDatabase();

app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
