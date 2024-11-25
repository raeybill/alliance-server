const createError = require("http-errors");
const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");

// Routes
const indexRouter = require("./routes/index");
const loginAuthRouter = require("./routes/auth/login");
const verifyAuthRouter = require("./routes/auth/verify-email");
const registerAuthRouter = require("./routes/auth/register");
const forgotPasswordAuthRouter = require("./routes/auth/forgot-password");
const transactionsRouter = require("./routes/transactions");
const usersRouter = require("./routes/users");

const app = express();
const PORT = 8080;
const MONGO_URI = "mongodb+srv://larkweb9:NtQjklo2loEAEErC@alliance.9ytuw.mongodb.net/alliance?retryWrites=true&w=majority";

// Middleware setup
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

// Routes setup
app.use("/", indexRouter);
app.use("/users", usersRouter); // Users route prefix
app.use("/auth/login", loginAuthRouter);
app.use("/auth/verify-email", verifyAuthRouter);
app.use("/auth/register", registerAuthRouter);
app.use("/auth/forgot-password", forgotPasswordAuthRouter);
app.use("/transactions", transactionsRouter);

// Error handling for 404 (Not Found)
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// General error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message,
    error: req.app.get("env") === "development" ? err : {},
  });
});

// MongoDB Connection
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Error connecting to MongoDB:", error));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
