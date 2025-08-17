import cors = require("cors");
import express = require("express");
import { initialize as partinitialize } from "./routes/part.routes";
import { initialize as poinitialize } from "./routes/po.routes";
import { initialize as poiteminitialize } from "./routes/poitem.routes";

const app = express();

app.use(
  cors({
    origin: "*",
  })
);

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to node.js application." });
});

partinitialize(app);
poinitialize(app);
poiteminitialize(app);

// set port, listen for requests
const PORT = ~~process.env.NODE_DOCKER_PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
