const dotenv = require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');


// Middlewares
// Take requests in as JSON and handle them as JSON.
app.use(express.json());
// Enable cookie parsing everywhere
app.use(cookieParser());

// Define the routes
const routes = require('./routes')

const transactionProcess = require('./processes/transactionProcess')

// When ... path is hit, use ...Router
app.use("/users", routes.usersRouter);
app.use("/sessions", routes.sessionsRouter);
app.use("/transfer", routes.transfersRouter);
app.use("/balance", routes.balanceRouter);
app.use("/logout", routes.logoutRouter);


// Database connection
mongoose.connect(process.env.DB_CONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true
  },
  () => console.log("Successfully to the database!")
);

// Listen to the server
const port = process.env.PORT || 9001;

transactionProcess.transactionProcess();

app.listen(port, () => {
  console.log(`Server kuulab port ${port} peal!`);
});
