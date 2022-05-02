import onSatVapor from "./onSatVapor.js";
import onSupVapor from "./onSupVapor.js";
import onCompLiquid from "./onCompLiquid.js";
import onSatLiquid from "./onSatLiquid.js";

export default function (tables, phase, inputValues) {
  if (phase === "sat.vapor") {
    return onSatVapor(tables, inputValues);
  } else if (phase === "sup.vapor") {
    return onSupVapor(tables, inputValues);
  } else if (phase === "comp.liquid") {
    return onCompLiquid(tables, inputValues);
  } else if (phase === "sat.liquid") {
    return onSatLiquid(tables, inputValues);
  }
}
