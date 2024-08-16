// import app from "./app.js";
// import connectDB from "./db/db.connection.js";
// import dotenv from "dotenv";
// dotenv.config({ path: "./.env" });

// connectDB()
//   .then(() => {
//     app.on("error", (error) => {
//       console.log("Error occured after DB connection : ", error);
//     });

//     // app.listen(process.env.PORT || 8000, () => {
//     //   console.log("App is running at port : ", process.env.PORT);
//     // });

//     app(req, res); // Use Express to handle the request
//   })
//   .catch((error) => {
//     console.log("MongoDB connection error : ", error);
//     process.exit(1);
//   });

// import app from "./app.js";
// import connectDB from "./db/db.connection.js";
// import dotenv from "dotenv";
// dotenv.config({ path: "./.env" });

// // Connect to the database before handling any requests
// export default async (req, res) => {
//   try {
//     await connectDB(); // Connect to MongoDB
//     return app(req, res); // Delegate request handling to Express
//   } catch (error) {
//     console.error("MongoDB connection error:", error);
//     res.status(500).send("Internal Server Error");
//   }
// };

import app from "./app.js";
import connectDB from "./db/db.connection.js";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

let dbConnected = false;

// Connect to the database when the server is first initialized
const initializeDB = async () => {
  try {
    if (!dbConnected) {
      await connectDB();
      dbConnected = true;
      console.log("Database connected successfully.");
    }
  } catch (error) {
    console.error("Database connection failed:", error);
    throw new Error("Database connection failed");
  }
};

// Handle incoming requests
export default async (req, res) => {
  try {
    await initializeDB(); // Ensure DB is connected
    return app(req, res); // Delegate request to Express
  } catch (error) {
    console.error("Request handling error:", error);
    res.status(500).send("Internal Server Error");
  }
};
