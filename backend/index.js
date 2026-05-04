require("dotenv").config();

const express = require("express");
const app = express();

const cors = require("cors");

const connectDB = require("./db/connect.js");

//routers
const authRouter = require("./routes/authRoutes.js");
const userRouter = require("./routes/userRoutes.js");
const accountRouter = require("./routes/accountRoutes.js");
const transactionRouter = require("./routes/transactionRoutes.js");

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("hello paytm");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/account", accountRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/transactions", transactionRouter);

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

// POST   /auth/signup
// POST   /auth/login
// GET    /users?filter=
// GET    /account/balance
// POST   /transactions/transfer
// GET    /transactions
