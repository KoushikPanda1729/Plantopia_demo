import app from "./src/app.js";
// import connectDB from "./db/db.connection.js";
import dotenv from "dotenv";
import connectDB from "./src/db/db.connection.js";
dotenv.config({ path: "./.env" });

connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("Error occured after DB connection : ", error);
    });

    app.listen(process.env.PORT || 8000, () => {
      console.log("App is running at port : ", process.env.PORT);
    });
  })
  .catch((error) => {
    console.log("MongoDB connection error : ", error);
    process.exit(1);
  });
