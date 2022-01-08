import mdns from "mdns";

export const createServiceBroadcast = (port: number): mdns.Advertisement => {
  return mdns.createAdvertisement(mdns.tcp("http"), port, {
    name: "RoboterCopy",
  });
};
