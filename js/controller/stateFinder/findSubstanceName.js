/**
 *
 * @param {number} number
 * @returns {string} substance
 */
export default function (number) {
  switch (number) {
    case 1:
      return "Water";
    case 2:
      return "Ammonia";
    case 3:
      return "Carbon Dioxide";
    case 4:
      return "R-410a";
    case 5:
      return "R-134a";
    case 6:
      return "Nitrogen";
    case 7:
      return "Methane";
  }
}
