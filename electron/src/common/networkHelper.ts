import * as os from "os";

export const findIpAddresses = (): string[] => {
  const interfaces = os.networkInterfaces();

  const results: string[] = [];

  for (const name of Object.keys(interfaces)) {
    const items = interfaces[name] ?? [];
    for (const net of items) {
      if (net.family === "IPv4" && !net.internal) {
        results.push(net.address);
      }
    }
  }

  return results;
};
