import app from "./app.js";
import connectDB from "./db/db.connection.js";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("Error occured after DB connection : ", error);
    });

    // app.listen(process.env.PORT || 8000, () => {
    //   console.log("App is running at port : ", process.env.PORT);
    // });

    app(req, res); // Use Express to handle the request
  })
  .catch((error) => {
    console.log("MongoDB connection error : ", error);
    process.exit(1);
  });
