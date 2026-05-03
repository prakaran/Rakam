require("dotenv").config();

const express = require("express");
const app = express();

const cors = require("cors");

const connectDB = require("./db/connect.js");

//routers
const authRouter = require("./routes/authRoutes.js");
const userRouter = require("./routes/userRoutes.js");

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("hello paytm");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);

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
