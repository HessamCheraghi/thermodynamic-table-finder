/**
 *
 * @param {number[][]} table a specific thermodynamic tables
 * @param {string} propertyName name of property that you need
 * @returns {number} index of that property on its specific table
 */
export default function (table, propertyName) {
  const type = table[0].length === 14 ? "sat." : table[0].length === 6 ? "sup.vapor|comp.liquid" : undefined;
  if (type === "sat.") {
    switch (propertyName) {
      case "temp.":
        return 0;
      case "press.":
        return 1;
      case "v_sat.liquid": //specific volume
        return 2;
      case "v_evap.":
        return 3;
      case "v_sat.vapor":
        return 4;
      case "u_sat.liquid": //internal energy
        return 5;
      case "u_evap.":
        return 6;
      case "u_sat.vapor":
        return 7;
      case "h_sat.liquid": //specific enthalpy
        return 8;
      case "h_evap.":
        return 9;
      case "h_sat.vapor":
        return 10;
      case "s_sat.liquid": //specific entropy
        return 11;
      case "s_evap.":
        return 12;
      case "s_sat.vapor":
        return 13;
      default:
        return undefined;
    }
  }
  if (type === "sup.vapor|comp.liquid") {
    switch (propertyName) {
      case "press.":
        return 0;
      case "temp.":
        return 1;
      case "v":
        return 2;
      case "u":
        return 3;
      case "h":
        return 4;
      case "s":
        return 5;
      default:
        return undefined;
    }
  } else {
    console.error("cannot find property index");
  }
}
