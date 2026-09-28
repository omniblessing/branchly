import { useContext } from "react";
import { DiscoveryContext, type DiscoveryContextValue } from "./discoveryContext";

export function useDiscovery(): DiscoveryContextValue {
  const ctx = useContext(DiscoveryContext);
  if (!ctx) throw new Error("useDiscovery must be used within DiscoveryProvider");
  return ctx;
}