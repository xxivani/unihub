const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const sequelize = require("./config/db");
const eventRoutes = require("./routes/eventRoutes");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/events", eventRoutes);

// Sync Database
sequelize.sync()
  .then(() => console.log("Database synced"))
  .catch(err => console.log("Database sync error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);