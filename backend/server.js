const express = require("express");
const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date(), version: "1.1.0", uptime: process.uptime() });
});

app.get("/api/activities", (req, res) => {
  res.json([]);
});

app.get("/api/users", (req, res) => {
  res.json([{ id: 1, name: "Alice" }]);
});

app.listen(3000, () => console.log("VitalSync API on :3000"));
