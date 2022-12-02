const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const userRouter = require("./routes/userRoute");

const app = express();

app.use(morgan("dev"));
app.use(cors());

app.use(express.json({ limit: "10kb" }));

app.use("/user", userRouter);
app.get("/", (req, res) => {
  res.json({ lala: "vdc" });
});

module.exports = app;
