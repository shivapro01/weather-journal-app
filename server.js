// Setup empty JS object to act as API endpoint
let projectData = {};

// Require Express and create an instance of the app
const express = require("express");
const app = express();

// Middleware
const cors = require("cors");
const bodyParser = require("body-parser");
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Initialize the main project folder
app.use(express.static("website"));

// GET route
app.get("/all", (req, res) => {
  res.send(projectData);
});

// POST route
app.post("/data", (req, res) => {
  const newData = req.body;
  projectData = {
    temperature: newData.temperature,
    date: newData.date,
    feelings: newData.feelings,
    weatherIcon: newData.weatherIcon,
  };
  console.log(projectData);
  res.send({ success: true });
});

// Starting the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
