import express from "express";
import { getHealthyServers } from "./utils/server-health-check";
import { checkIsServiceUnavailableError, withRetry } from "./utils/helpers";

const app = express();
const PORT = 80;

const healthCheckPeriod = parseInt(
  process.argv
    .find((arg) => arg.startsWith("--health-check-period="))
    ?.split("=")[1] || "60000",
  10
);

console.log(`Health check period is set to: ${healthCheckPeriod}ms`);

const getServerAddress = getHealthyServers(
  ["http://localhost:8080", "http://localhost:8081", "http://localhost:8082"],
  healthCheckPeriod
);

app.get("/", async (req, res) => {
  console.log("Received request from", req.ip);
  console.log(req.method, req.path, `${req.protocol}/${req.httpVersion}`);
  console.log("Host:", req.hostname);
  console.log("User Agent:", req.get("User-agent"));

  const fetchResponse = async () => {
    const response = (await Promise.race([
      fetch(getServerAddress()),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("timeout")), 5000)
      ),
    ])) as Response;
    const resParsed = await response.text();
    res.send(resParsed);
  };

  try {
    await withRetry(fetchResponse, 2);
  } catch (e) {
    checkIsServiceUnavailableError(e, () =>
      res.status(503).send("Service unavailable")
    );
  }
});

app.listen(PORT, () => {
  console.log(`server started at port: ${PORT}`);
});
