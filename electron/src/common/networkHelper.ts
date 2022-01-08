import * as os from "os";
import mdns from "mdns";

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

export const createServiceBroadcast = (port: number): mdns.Advertisement => {
  const serviceType = mdns.makeServiceType("roco", "tcp");
  return mdns.createAdvertisement(mdns.tcp("http"), port, {
    name: "RoboterCopy",
  });
};
