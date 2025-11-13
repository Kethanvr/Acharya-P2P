/* eslint-disable @typescript-eslint/no-var-requires */
const io = require("socket.io-client");
const path = require("path");
const fs = require("fs");

const DATA_DIR = path.join(__dirname, "..", "data");
const sites = JSON.parse(fs.readFileSync(path.join(DATA_DIR, "sites.json"), "utf8"));

const WS_URL = process.env.NEXT_PUBLIC_TELEMETRY_WS_URL || "ws://localhost:4000";
const socket = io(WS_URL);

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

socket.on("connect", () => {
  console.log(`Telemetry simulator connected to ${WS_URL}`);

  const intervalId = setInterval(() => {
    sites.forEach((site) => {
      const payload = {
        siteId: site.id,
        timestamp: new Date().toISOString(),
        power_kw: Number(rand(0.2, site.capacity_kw).toFixed(3)),
        battery_pct: Math.min(100, Math.max(0, Math.round(rand(30, 100)))),
      };
      socket.emit("telemetry", payload);
      console.log("sent", payload);
    });
  }, 3000);

  socket.on("disconnect", () => {
    clearInterval(intervalId);
    console.log("Telemetry simulator disconnected");
  });
});

socket.on("connect_error", (error) => {
  console.error("Telemetry simulator connection error:", error.message);
});

