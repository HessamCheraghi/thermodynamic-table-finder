export default function (table, propertyName) {
  const type = table[0].length === 14 ? "sat." : "super";
  let index;
  if (type === "sat.") {
    switch (propertyName) {
      case "temp.":
        index = 0;
        break;
      case "press.":
        index = 1;
        break;
      case "v_sat.liquid": //specific volume
        index = 2;
        break;
      case "v_evap.":
        index = 3;
        break;
      case "v_sat.vapor":
        index = 4;
        break;
      case "u_sat.liquid": //internal energy
        index = 5;
        break;
      case "u_evap.":
        index = 6;
        break;
      case "u_sat.vapor":
        index = 7;
        break;
      case "h_sat.liquid": //specific enthalpy
        index = 8;
        break;
      case "h_evap.":
        index = 9;
        break;
      case "h_sat.vapor":
        index = 10;
        break;
      case "s_sat.liquid": //specific entropy
        index = 11;
        break;
      case "s_evap.":
        index = 12;
        break;
      case "s_sat.vapor":
        index = 13;
        break;
      default:
        index = undefined;
    }
  }
  if (type === "super") {
    switch (propertyName) {
      case "press.":
        index = 0;
        break;
      case "temp.":
        index = 1;
        break;
      case "v":
        index = 2;
        break;
      case "u":
        index = 3;
        break;
      case "h":
        index = 4;
        break;
      case "s":
        index = 5;
        break;
      default:
        index = undefined;
    }
  }
  return index;
}
