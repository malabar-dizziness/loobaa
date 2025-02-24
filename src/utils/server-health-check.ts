// Uses Round Robin algorithm
export const getHealthyServers = (arr: string[]) => {
  let healthyServers = new Set(arr);
  let unhealthyServers = new Set<string>();
  let index = 0;

  setInterval(() => {
    // Check healthy servers
    healthyServers.forEach((server) => {
      fetch(`${server}/health`).catch(() => {
        if (!unhealthyServers.has(server)) {
          healthyServers.delete(server);
          unhealthyServers.add(server);
          console.log(`Server ${server} is unhealthy.`);
        }
      });
    });

    // Check unhealthy servers and try adding them back if healthy
    unhealthyServers.forEach((server, index) => {
      fetch(`${server}/health`).then(() => {
        healthyServers.add(server);
        unhealthyServers.delete(server); // Add back to healthy set
        console.log(`Server ${server} is healthy again.`);
      });
    });
  }, 60000);

  return () => {
    if (healthyServers.size === 0) {
      throw new Error("Service unavailable");
    }

    const servers = Array.from(healthyServers);
    if (index >= servers.length) index = 0;
    return servers[index++];
  };
};
