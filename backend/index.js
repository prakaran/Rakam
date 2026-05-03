require("dotenv").config();
const express = require("express");
const connectDB = require("./db/connect.js");
const router = require("./routes/index.js");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("hello paytm");
});
app.use("/api/v1", router);

const port = 3000;
const start = async () => {
  try {
    await connectDB(process.env.DATABASE_URI);
    app.listen(port, () => console.log(`Server is listening on ${port}...`));
  } catch (error) {
    console.log(error);
  }
};
start();
