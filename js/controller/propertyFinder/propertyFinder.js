import onSatVapor from "./onSatVapor/index.js";
import onSupVapor from "./onSupVapor/index.js";
import onCompLiquid from "./onCompLiquid/index.js";
import fallback from "./fallback/index.js";

export default function (tables, phase, inputValues) {
  if (phase === "sat.vapor") {
    return onSatVapor(tables, inputValues);
  } else if (phase === "sup.vapor") {
    return onSupVapor(tables, inputValues);
  } else if (phase === "comp.liquid") {
    return onCompLiquid(tables, inputValues);
  } else if (phase === "sat.liquid") {
    return fallback(tables, inputValues, "sat.liquid");
  } else if (phase === "sat.vapor(fallback)") {
    return fallback(tables, inputValues, "sat.vapor");
  }
}
