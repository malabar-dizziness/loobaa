import express from "express";

const app = express();
const PORT = 80;

// Uses Round Robin algorithm
const getHealthyServers = (arr: string[]) => {
  let servers = arr;
  let index = 0;

  setInterval(() => {
    servers.forEach((server) => {
      fetch(`${server}/health`).catch(() => {
        servers = servers.filter((s) => s !== server);
      });
    });
  }, 10000);

  return () => {
    if (index >= servers.length) index = 0;

    return servers[index++];
  };
};

const getServerAddress = getHealthyServers([
  "http://localhost:8080",
  "http://localhost:8081",
  "http://localhost:8082",
]);

const withRetry = async (fn: () => Promise<void>, retry: number) => {
  try {
    await fn();
  } catch (e) {
    if (retry <= 0) {
      throw e;
    }
    withRetry(fn, --retry);
  }
};

app.get("/", async (req, res) => {
  console.log("Received request from", req.ip);
  console.log(req.method, req.path, `${req.protocol}/${req.httpVersion}`);
  console.log("Host:", req.hostname);
  console.log("User Agent:", req.get("User-agent"));

  const fetchResponse = async () => {
    const response = await fetch(getServerAddress());
    const resParsed = await response.text();
    res.send(resParsed);
  };

  await withRetry(fetchResponse, 2);
});

app.listen(PORT, () => {
  console.log(`server started at port: ${PORT}`);
});
