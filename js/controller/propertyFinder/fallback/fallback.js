import propertyIndex from "../../propertyIndex.js";
import smartSearch from "../../smartSearch/index.js";
import interpolator from "../../interpolator.js";
/**
 *
 * @param {object} tables all thermodynamic tables
 * @param {Object.<string, ?number>} inputValues an object containing all property values
 * @param {string} phase the requested phase in string (either `sat.liquid` or `sat.vapor`)
 * @returns {Object.<string, ?number>}  an object containing all calculated values
 */
export default function (tables, inputValues, phase) {
  const outputValues = { ...inputValues };
  if (phase === "sat.liquid") {
    if (inputValues.temperature) {
      const table = tables[`b${inputValues.substance}1`];
      const tempIndex = propertyIndex(table, "temp.");
      const pressIndex = propertyIndex(table, "press.");
      const vIndex = propertyIndex(table, "v_sat.liquid");
      const uIndex = propertyIndex(table, "u_sat.liquid");
      const hIndex = propertyIndex(table, "h_sat.liquid");
      const sIndex = propertyIndex(table, "s_sat.liquid");
      const tempResult = smartSearch(table, "temp.", inputValues.temperature);
      console.log(`searching table b.${inputValues.substance}.1`);
      if (tempResult.statusCode === "101" || tempResult.statusCode === "102") {
        throw new Error("cannot find saturation properties try searching manually");
      }
      if (tempResult.statusCode === "200") {
        const res = tempResult.result;
        console.log(`found exact row =>\n [${res[tempIndex]}, ${res[pressIndex]}, ${res[vIndex]}, ${res[uIndex]}, ${res[hIndex]}, ${res[sIndex]}]`);
        outputValues.pressure = inputValues.pressure ?? tempResult.result[pressIndex];
        outputValues.specificVolume = inputValues.specificVolume ?? tempResult.result[vIndex];
        outputValues.internalEnergy = inputValues.internalEnergy ?? tempResult.result[uIndex];
        outputValues.specificEnthalpy = inputValues.specificEnthalpy ?? tempResult.result[hIndex];
        outputValues.specificEntropy = inputValues.specificEntropy ?? tempResult.result[sIndex];
      }
      if (tempResult.statusCode === "300") {
        const temp = inputValues.temperature;
        const res = tempResult.result;
        console.log(
          `found surrounding rows =>\n [${res[0][tempIndex]}, ${res[0][pressIndex]}, ${res[0][vIndex]}, ${res[0][uIndex]}, ${res[0][hIndex]}, ${res[0][sIndex]}],\n [${res[1][tempIndex]}, ${res[1][pressIndex]}, ${res[1][vIndex]}, ${res[1][uIndex]}, ${res[1][hIndex]}, ${res[1][sIndex]}]\n\n`
        );
        outputValues.pressure = inputValues.pressure ?? interpolator(temp, res[0][tempIndex], res[1][tempIndex], res[0][pressIndex], res[1][pressIndex]);
        outputValues.specificVolume =
          inputValues.specificVolume ?? interpolator(temp, res[0][tempIndex], res[1][tempIndex], res[0][vIndex], res[1][pressIndex]);
        outputValues.internalEnergy = inputValues.internalEnergy ?? interpolator(temp, res[0][tempIndex], res[1][tempIndex], res[0][uIndex], res[1][uIndex]);
        outputValues.specificEnthalpy =
          inputValues.specificEnthalpy ?? interpolator(temp, res[0][tempIndex], res[1][tempIndex], res[0][hIndex], res[1][hIndex]);
        outputValues.specificEntropy = inputValues.specificEntropy ?? interpolator(temp, res[0][tempIndex], res[1][tempIndex], res[0][sIndex], res[1][sIndex]);
      }
    } else if (inputValues.pressure) {
      const table = inputValues.substance === 1 ? tables.b12 : tables[`b${inputValues.substance}1`];
      const tempIndex = inputValues.substance === 1 ? 1 : propertyIndex(table, "temp.");
      const pressIndex = inputValues.substance === 1 ? 0 : propertyIndex(table, "press.");
      const vIndex = propertyIndex(table, "v_sat.liquid");
      const uIndex = propertyIndex(table, "u_sat.liquid");
      const hIndex = propertyIndex(table, "h_sat.liquid");
      const sIndex = propertyIndex(table, "s_sat.liquid");
      const tempResult = smartSearch(table, inputValues.substance === 1 ? 0 : "press.", inputValues.temperature);
      console.log(`searching table b1${inputValues.substance === 1 ? "b12" : `b${inputValues.substance}1`}`);
      if (tempResult.statusCode === "101" || tempResult.statusCode === "102") {
        throw new Error("cannot find saturation properties try searching manually");
      }
      if (tempResult.statusCode === "200") {
        const res = tempResult.result;
        console.log(`found exact row =>\n [${res[tempIndex]}, ${res[pressIndex]}, ${res[vIndex]}, ${res[uIndex]}, ${res[hIndex]}, ${res[sIndex]}]`);
        outputValues.pressure = inputValues.pressure ?? res[pressIndex];
        outputValues.specificVolume = inputValues.specificVolume ?? res[vIndex];
        outputValues.internalEnergy = inputValues.internalEnergy ?? res[uIndex];
        outputValues.specificEnthalpy = inputValues.specificEnthalpy ?? res[hIndex];
        outputValues.specificEntropy = inputValues.specificEntropy ?? res[sIndex];
      }
      if (tempResult.statusCode === "300") {
        const temp = inputValues.temperature;
        const res = tempResult.result;
        console.log(
          `found surrounding rows =>\n [${res[0][tempIndex]}, ${res[0][pressIndex]}, ${res[0][vIndex]}, ${res[0][uIndex]}, ${res[0][hIndex]}, ${res[0][sIndex]}],\n [${res[1][tempIndex]}, ${res[1][pressIndex]}, ${res[1][vIndex]}, ${res[1][uIndex]}, ${res[1][hIndex]}, ${res[1][sIndex]}]\n\n`
        );
        outputValues.pressure = inputValues.pressure ?? interpolator(temp, res[0][tempIndex], res[1][tempIndex], res[0][pressIndex], res[1][pressIndex]);
        outputValues.specificVolume =
          inputValues.specificVolume ?? interpolator(temp, res[0][tempIndex], res[1][tempIndex], res[0][vIndex], res[1][pressIndex]);
        outputValues.internalEnergy = inputValues.internalEnergy ?? interpolator(temp, res[0][tempIndex], res[1][tempIndex], res[0][uIndex], res[1][uIndex]);
        outputValues.specificEnthalpy =
          inputValues.specificEnthalpy ?? interpolator(temp, res[0][tempIndex], res[1][tempIndex], res[0][hIndex], res[1][hIndex]);
        outputValues.specificEntropy = inputValues.specificEntropy ?? interpolator(temp, res[0][tempIndex], res[1][tempIndex], res[0][sIndex], res[1][sIndex]);
      }
    }
  }
  if (phase === "sat.vapor") {
    if (inputValues.temperature) {
      const table = tables[`b${inputValues.substance}1`];
      const tempIndex = propertyIndex(table, "temp.");
      const pressIndex = propertyIndex(table, "press.");
      const vIndex = propertyIndex(table, "v_sat.vapor");
      const uIndex = propertyIndex(table, "u_sat.vapor");
      const hIndex = propertyIndex(table, "h_sat.vapor");
      const sIndex = propertyIndex(table, "s_sat.vapor");
      const tempResult = smartSearch(table, "temp.", inputValues.temperature);
      console.log(`searching table b.${inputValues.substance}.1`);
      if (tempResult.statusCode === "101" || tempResult.statusCode === "102") {
        throw new Error("cannot find saturation properties try searching manually");
      }
      if (tempResult.statusCode === "200") {
        const res = tempResult.result;
        console.log(`found exact row =>\n [${res[tempIndex]}, ${res[pressIndex]}, ${res[vIndex]}, ${res[uIndex]}, ${res[hIndex]}, ${res[sIndex]}]`);
        outputValues.pressure = inputValues.pressure ?? tempResult.result[pressIndex];
        outputValues.specificVolume = inputValues.specificVolume ?? tempResult.result[vIndex];
        outputValues.internalEnergy = inputValues.internalEnergy ?? tempResult.result[uIndex];
        outputValues.specificEnthalpy = inputValues.specificEnthalpy ?? tempResult.result[hIndex];
        outputValues.specificEntropy = inputValues.specificEntropy ?? tempResult.result[sIndex];
      }
      if (tempResult.statusCode === "300") {
        const temp = inputValues.temperature;
        const res = tempResult.result;
        console.log(
          `found surrounding rows =>\n [${res[0][tempIndex]}, ${res[0][pressIndex]}, ${res[0][vIndex]}, ${res[0][uIndex]}, ${res[0][hIndex]}, ${res[0][sIndex]}],\n [${res[1][tempIndex]}, ${res[1][pressIndex]}, ${res[1][vIndex]}, ${res[1][uIndex]}, ${res[1][hIndex]}, ${res[1][sIndex]}]\n\n`
        );
        outputValues.pressure = inputValues.pressure ?? interpolator(temp, res[0][tempIndex], res[1][tempIndex], res[0][pressIndex], res[1][pressIndex]);
        outputValues.specificVolume =
          inputValues.specificVolume ?? interpolator(temp, res[0][tempIndex], res[1][tempIndex], res[0][vIndex], res[1][pressIndex]);
        outputValues.internalEnergy = inputValues.internalEnergy ?? interpolator(temp, res[0][tempIndex], res[1][tempIndex], res[0][uIndex], res[1][uIndex]);
        outputValues.specificEnthalpy =
          inputValues.specificEnthalpy ?? interpolator(temp, res[0][tempIndex], res[1][tempIndex], res[0][hIndex], res[1][hIndex]);
        outputValues.specificEntropy = inputValues.specificEntropy ?? interpolator(temp, res[0][tempIndex], res[1][tempIndex], res[0][sIndex], res[1][sIndex]);
      }
    } else if (inputValues.pressure) {
      const table = inputValues.substance === 1 ? tables.b12 : tables[`b${inputValues.substance}1`];
      const tempIndex = inputValues.substance === 1 ? 1 : propertyIndex(table, "temp.");
      const pressIndex = inputValues.substance === 1 ? 0 : propertyIndex(table, "press.");
      const vIndex = propertyIndex(table, "v_sat.vapor");
      const uIndex = propertyIndex(table, "u_sat.vapor");
      const hIndex = propertyIndex(table, "h_sat.vapor");
      const sIndex = propertyIndex(table, "s_sat.vapor");
      const tempResult = smartSearch(table, inputValues.substance === 1 ? 0 : "press.", inputValues.temperature);
      console.log(`searching table ${inputValues.substance === 1 ? "b12" : `b${inputValues.substance}1`}`);
      if (tempResult.statusCode === "101" || tempResult.statusCode === "102") {
        throw new Error("cannot find saturation properties try searching manually");
      }
      if (tempResult.statusCode === "200") {
        const res = tempResult.result;
        console.log(`found exact row =>\n [${res[tempIndex]}, ${res[pressIndex]}, ${res[vIndex]}, ${res[uIndex]}, ${res[hIndex]}, ${res[sIndex]}]`);
        outputValues.pressure = inputValues.pressure ?? tempResult.result[pressIndex];
        outputValues.specificVolume = inputValues.specificVolume ?? tempResult.result[vIndex];
        outputValues.internalEnergy = inputValues.internalEnergy ?? tempResult.result[uIndex];
        outputValues.specificEnthalpy = inputValues.specificEnthalpy ?? tempResult.result[hIndex];
        outputValues.specificEntropy = inputValues.specificEntropy ?? tempResult.result[sIndex];
      }
      if (tempResult.statusCode === "300") {
        const temp = inputValues.temperature;
        const res = tempResult.result;
        console.log(
          `found surrounding rows =>\n [${res[0][tempIndex]}, ${res[0][pressIndex]}, ${res[0][vIndex]}, ${res[0][uIndex]}, ${res[0][hIndex]}, ${res[0][sIndex]}],\n [${res[1][tempIndex]}, ${res[1][pressIndex]}, ${res[1][vIndex]}, ${res[1][uIndex]}, ${res[1][hIndex]}, ${res[1][sIndex]}]\n\n`
        );
        outputValues.pressure = inputValues.pressure ?? interpolator(temp, res[0][tempIndex], res[1][tempIndex], res[0][pressIndex], res[1][pressIndex]);
        outputValues.specificVolume =
          inputValues.specificVolume ?? interpolator(temp, res[0][tempIndex], res[1][tempIndex], res[0][vIndex], res[1][pressIndex]);
        outputValues.internalEnergy = inputValues.internalEnergy ?? interpolator(temp, res[0][tempIndex], res[1][tempIndex], res[0][uIndex], res[1][uIndex]);
        outputValues.specificEnthalpy =
          inputValues.specificEnthalpy ?? interpolator(temp, res[0][tempIndex], res[1][tempIndex], res[0][hIndex], res[1][hIndex]);
        outputValues.specificEntropy = inputValues.specificEntropy ?? interpolator(temp, res[0][tempIndex], res[1][tempIndex], res[0][sIndex], res[1][sIndex]);
      }
    }
  }

  return outputValues;
}
