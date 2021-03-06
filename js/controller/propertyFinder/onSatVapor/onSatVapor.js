import smartSearch from "../../smartSearch/index.js";
import propertyIndex from "../../propertyIndex.js";
import interpolator from "../../interpolator.js";
import UI from "../../../view/index.js";
/**
 *
 * @param {number[][]} tables all thermodynamic tables
 * @param {Object.<string, ?number>} inputValues
 * @returns {Object.<string, ?number>}  an object containing all calculated values
 */
export default function (tables, inputValues) {
  UI.log("");
  const outputValues = { ...inputValues };
  const substance = inputValues.substance;

  if (substance === 1 && inputValues.pressure) {
    //#region base variables
    const table = tables.b12;
    const pressure = inputValues.pressure;
    const pressIndex = 0; // on table b12 pressure is first value of array
    const pressResult = smartSearch(table, 0, pressure);
    const tempIndex = 1; // and temperature is second
    //#endregion

    if (pressResult.statusCode === "200") {
      //#region find saturation temperature
      outputValues.temperature = pressResult.result[tempIndex];
      UI.log(`saturated temperature is ${outputValues.temperature}`);
      UI.log("");
      //#endregion

      //#region find x
      if (inputValues.specificVolume) {
        UI.log("finding quality based on specific volume...");
        const vf = pressResult.result[propertyIndex(table, "v_sat.liquid")];
        const vfg = pressResult.result[propertyIndex(table, "v_evap.")];
        const quality = (inputValues.specificVolume - vf) / vfg;
        UI.log(`vf = ${vf}, vfg = ${vfg}, x = (${inputValues.specificVolume} - ${vf}) / ${vfg}`);
        outputValues.quality = quality;
      } else if (inputValues.internalEnergy) {
        UI.log("finding quality based on internal energy...");
        const uf = pressResult.result[propertyIndex(table, "u_sat.liquid")];
        const ufg = pressResult.result[propertyIndex(table, "u_evap.")];
        const quality = (inputValues.internalEnergy - uf) / ufg;
        UI.log(`uf = ${uf}, ufg = ${ufg}, x = (${inputValues.internalEnergy} - ${uf}) / ${ufg}`);
        outputValues.quality = quality;
      } else if (inputValues.specificEnthalpy) {
        UI.log("finding quality based on specific enthalpy...");
        const hf = pressResult.result[propertyIndex(table, "h_sat.liquid")];
        const hfg = pressResult.result[propertyIndex(table, "h_evap.")];
        const quality = (inputValues.specificEnthalpy - hf) / hfg;
        UI.log(`hf = ${hf}, hfg = ${hfg}, x = (${inputValues.specificEnthalpy} - ${hf}) / ${hfg}`);
        outputValues.quality = quality;
      } else if (inputValues.specificEntropy) {
        UI.log("finding quality based on specific entropy...");
        const sf = pressResult.result[propertyIndex(table, "s_sat.liquid")];
        const sfg = pressResult.result[propertyIndex(table, "s_evap.")];
        const quality = (inputValues.specificEntropy - sf) / sfg;
        UI.log(`sf = ${sf}, sfg = ${sfg}, x = (${inputValues.specificEntropy} - ${sf}) / ${sfg}`);
        outputValues.quality = quality;
      }
      const quality = outputValues.quality;
      UI.log(`x = ${quality}`);
      UI.log("");
      //#endregion

      //#region find v u h s
      if (inputValues.specificVolume === null) {
        const vf = pressResult.result[propertyIndex(table, "v_sat.liquid")];
        const vfg = pressResult.result[propertyIndex(table, "v_evap.")];
        const v = vf + quality * vfg;

        UI.log("finding specific volume based on quality...");
        UI.log(`vf = ${vf}, vfg = ${vfg}, v = (${vf} + ${quality} * ${vfg})`);
        UI.log(`v = ${v}`);

        outputValues.specificVolume = v;
      }
      if (inputValues.internalEnergy === null) {
        const uf = pressResult.result[propertyIndex(table, "u_sat.liquid")];
        const ufg = pressResult.result[propertyIndex(table, "u_evap.")];
        const u = uf + quality * ufg;

        UI.log("finding internal energy based on quality...");
        UI.log(`uf = ${uf}, ufg = ${ufg}, u = (${uf} + ${quality} * ${ufg})`);
        UI.log(`u = ${u}`);

        outputValues.internalEnergy = u;
      }
      if (inputValues.specificEnthalpy === null) {
        const hf = pressResult.result[propertyIndex(table, "h_sat.liquid")];
        const hfg = pressResult.result[propertyIndex(table, "h_evap.")];
        const h = hf + quality * hfg;

        UI.log("finding specific enthalpy based on quality...");
        UI.log(`hf = ${hf}, hfg = ${hfg}, h = (${hf} + ${quality} * ${hfg})`);
        UI.log(`h = ${h}`);

        outputValues.specificEnthalpy = h;
      }
      if (inputValues.specificEntropy === null) {
        const sf = pressResult.result[propertyIndex(table, "s_sat.liquid")];
        const sfg = pressResult.result[propertyIndex(table, "s_evap.")];
        const s = sf + quality * sfg;

        UI.log("finding specific entropy based on quality...");
        UI.log(`sf = ${sf}, sfg = ${sfg}, s = (${sf} + ${quality} * ${sfg})`);
        UI.log(`s = ${s}`);

        outputValues.specificEntropy = s;
      }
      //#endregion

      return outputValues;
    } else if ((pressResult.statusCode = "300")) {
      // if didn't found exact temperature =>

      //#region find temperature
      UI.log("start interpolation to find saturated temperature");
      const temperature = interpolator(
        pressure,
        pressResult.result[0][pressIndex],
        pressResult.result[1][pressIndex],
        pressResult.result[0][tempIndex],
        pressResult.result[1][tempIndex]
      );
      outputValues.temperature = temperature;
      UI.log(`saturated temperature is ${outputValues.temperature}`);
      UI.log("");
      //#endregion

      //#region find x
      if (inputValues.specificVolume) {
        UI.log("finding quality based on specific volume...");
        const vfIndex = propertyIndex(table, "v_sat.liquid");
        const vfgIndex = propertyIndex(table, "v_evap.");

        const vf = interpolator(
          pressure,
          pressResult.result[0][pressIndex],
          pressResult.result[1][pressIndex],
          pressResult.result[0][vfIndex],
          pressResult.result[1][vfIndex]
        );

        const vfg = interpolator(
          pressure,
          pressResult.result[0][pressIndex],
          pressResult.result[1][pressIndex],
          pressResult.result[0][vfgIndex],
          pressResult.result[1][vfgIndex]
        );

        const quality = (inputValues.specificVolume - vf) / vfg;
        UI.log(`vf = ${vf}, vfg = ${vfg}, x = (${inputValues.specificVolume} - ${vf}) / ${vfg}`);
        outputValues.quality = quality;
      }
      if (inputValues.internalEnergy) {
        UI.log("finding quality based on internal energy...");
        const ufIndex = propertyIndex(table, "u_sat.liquid");
        const ufgIndex = propertyIndex(table, "u_evap.");

        const uf = interpolator(
          pressure,
          pressResult.result[0][pressIndex],
          pressResult.result[1][pressIndex],
          pressResult.result[0][ufIndex],
          pressResult.result[1][ufIndex]
        );

        const ufg = interpolator(
          pressure,
          pressResult.result[0][pressIndex],
          pressResult.result[1][pressIndex],
          pressResult.result[0][ufgIndex],
          pressResult.result[1][ufgIndex]
        );

        const quality = (inputValues.internalEnergy - uf) / ufg;
        UI.log(`uf = ${uf}, ufg = ${ufg}, x = (${inputValues.internalEnergy} - ${uf}) / ${ufg}`);
        outputValues.quality = quality;
      }
      if (inputValues.specificEnthalpy) {
        UI.log("finding quality based on specific enthalpy...");
        const hfIndex = propertyIndex(table, "h_sat.liquid");
        const hfgIndex = propertyIndex(table, "h_evap.");

        const hf = interpolator(
          pressure,
          pressResult.result[0][pressIndex],
          pressResult.result[1][pressIndex],
          pressResult.result[0][hfIndex],
          pressResult.result[1][hfIndex]
        );

        const hfg = interpolator(
          pressure,
          pressResult.result[0][pressIndex],
          pressResult.result[1][pressIndex],
          pressResult.result[0][hfgIndex],
          pressResult.result[1][hfgIndex]
        );

        const quality = (inputValues.specificEnthalpy - hf) / hfg;
        UI.log(`hf = ${hf}, hfg = ${hfg}, x = (${inputValues.specificEnthalpy} - ${hf}) / ${hfg}`);
        outputValues.quality = quality;
      }
      if (inputValues.specificEntropy) {
        UI.log("finding quality based on specific entropy...");
        const sfIndex = propertyIndex(table, "s_sat.liquid");
        const sfgIndex = propertyIndex(table, "s_evap.");

        const sf = interpolator(
          pressure,
          pressResult.result[0][pressIndex],
          pressResult.result[1][pressIndex],
          pressResult.result[0][sfIndex],
          pressResult.result[1][sfIndex]
        );

        const sfg = interpolator(
          pressure,
          pressResult.result[0][pressIndex],
          pressResult.result[1][pressIndex],
          pressResult.result[0][sfgIndex],
          pressResult.result[1][sfgIndex]
        );

        const quality = (inputValues.specificEntropy - sf) / sfg;
        UI.log(`sf = ${sf}, sfg = ${sfg}, x = (${inputValues.specificEntropy} - ${sf}) / ${sfg}`);
        outputValues.quality = quality;
      }
      const quality = outputValues.quality;
      UI.log(`x = ${quality}`);
      UI.log("");
      //#endregion

      //#region find v u h s
      if (inputValues.specificVolume === null) {
        UI.log("finding specific volume based on quality...");

        const vfIndex = propertyIndex(table, "v_sat.liquid");
        const vfgIndex = propertyIndex(table, "v_evap.");

        const vf = interpolator(
          pressure,
          pressResult.result[0][pressIndex],
          pressResult.result[1][pressIndex],
          pressResult.result[0][vfIndex],
          pressResult.result[1][vfIndex]
        );

        const vfg = interpolator(
          pressure,
          pressResult.result[0][pressIndex],
          pressResult.result[1][pressIndex],
          pressResult.result[0][vfgIndex],
          pressResult.result[1][vfgIndex]
        );
        const v = vf + quality * vfg;

        UI.log(`vf = ${vf}, vfg = ${vfg}, v = (${vf} + ${quality} * ${vfg})`);
        UI.log(`v = ${v}`);
        UI.log("");

        outputValues.specificVolume = v;
      }
      if (inputValues.internalEnergy === null) {
        UI.log("finding internal energy based on quality...");

        const ufIndex = propertyIndex(table, "u_sat.liquid");
        const ufgIndex = propertyIndex(table, "u_evap.");

        const uf = interpolator(
          pressure,
          pressResult.result[0][pressIndex],
          pressResult.result[1][pressIndex],
          pressResult.result[0][ufIndex],
          pressResult.result[1][ufIndex]
        );

        const ufg = interpolator(
          pressure,
          pressResult.result[0][pressIndex],
          pressResult.result[1][pressIndex],
          pressResult.result[0][ufgIndex],
          pressResult.result[1][ufgIndex]
        );
        const u = uf + quality * ufg;

        UI.log(`uf = ${uf}, ufg = ${ufg}, u = (${uf} + ${quality} * ${ufg})`);
        UI.log(`u = ${u}`);
        UI.log("");

        outputValues.internalEnergy = u;
      }
      if (inputValues.specificEnthalpy === null) {
        UI.log("finding specific enthalpy based on quality...");
        const hfIndex = propertyIndex(table, "h_sat.liquid");
        const hfgIndex = propertyIndex(table, "h_evap.");

        const hf = interpolator(
          pressure,
          pressResult.result[0][pressIndex],
          pressResult.result[1][pressIndex],
          pressResult.result[0][hfIndex],
          pressResult.result[1][hfIndex]
        );

        const hfg = interpolator(
          pressure,
          pressResult.result[0][pressIndex],
          pressResult.result[1][pressIndex],
          pressResult.result[0][hfgIndex],
          pressResult.result[1][hfgIndex]
        );
        const h = hf + quality * hfg;

        UI.log(`hf = ${hf}, hfg = ${hfg}, h = (${hf} + ${quality} * ${hfg})`);
        UI.log(`h = ${h}`);
        UI.log("");

        outputValues.specificEnthalpy = h;
      }
      if (inputValues.specificEntropy === null) {
        UI.log("finding specific entropy based on quality...");

        const sfIndex = propertyIndex(table, "s_sat.liquid");
        const sfgIndex = propertyIndex(table, "s_evap.");

        const sf = interpolator(
          pressure,
          pressResult.result[0][pressIndex],
          pressResult.result[1][pressIndex],
          pressResult.result[0][sfIndex],
          pressResult.result[1][sfIndex]
        );

        const sfg = interpolator(
          pressure,
          pressResult.result[0][pressIndex],
          pressResult.result[1][pressIndex],
          pressResult.result[0][sfgIndex],
          pressResult.result[1][sfgIndex]
        );
        const s = sf + quality * sfg;
        UI.log(`sf = ${sf}, sfg = ${sfg}, s = (${sf} + ${quality} * ${sfg})`);
        UI.log(`s = ${s}`);
        UI.log("");

        outputValues.specificEntropy = s;
      }
      //#endregion
      return outputValues;
    }
  } else if (inputValues.temperature) {
    //#region base variables
    const table = tables["b1" + substance];
    const temp = inputValues.temperature;
    const tempIndex = propertyIndex(table, "temp.");
    const tempResult = smartSearch(table, "temp.", temp);
    const pressIndex = propertyIndex(table, "press.");
    //#endregion

    if (tempResult.statusCode === "200") {
      //#region find pressure
      outputValues.pressure = tempResult.result[pressIndex];
      UI.log(`saturated pressure is ${outputValues.pressure}`);
      UI.log("");
      //#endregion

      //#region find x
      if (inputValues.specificVolume) {
        UI.log("finding quality based on specific volume...");
        const vf = tempResult.result[propertyIndex(table, "v_sat.liquid")];
        const vfg = tempResult.result[propertyIndex(table, "v_evap.")];
        const quality = (inputValues.specificVolume - vf) / vfg;
        UI.log(`vf = ${vf}, vfg = ${vfg}, x = (${inputValues.specificVolume} - ${vf}) / ${vfg}`);
        outputValues.quality = quality;
      } else if (inputValues.internalEnergy) {
        UI.log("finding quality based on internal energy...");
        const uf = tempResult.result[propertyIndex(table, "u_sat.liquid")];
        const ufg = tempResult.result[propertyIndex(table, "u_evap.")];
        const quality = (inputValues.internalEnergy - uf) / ufg;
        UI.log(`uf = ${uf}, ufg = ${ufg}, x = (${inputValues.internalEnergy} - ${uf}) / ${ufg}`);
        outputValues.quality = quality;
      } else if (inputValues.specificEnthalpy) {
        UI.log("finding quality based on specific enthalpy...");
        const hf = tempResult.result[propertyIndex(table, "h_sat.liquid")];
        const hfg = tempResult.result[propertyIndex(table, "h_evap.")];
        const quality = (inputValues.specificEnthalpy - hf) / hfg;
        UI.log(`hf = ${hf}, hfg = ${hfg}, x = (${inputValues.specificEnthalpy} - ${hf}) / ${hfg}`);
        outputValues.quality = quality;
      } else if (inputValues.specificEntropy) {
        UI.log("finding quality based on specific entropy...");
        const sf = tempResult.result[propertyIndex(table, "s_sat.liquid")];
        const sfg = tempResult.result[propertyIndex(table, "s_evap.")];
        const quality = (inputValues.specificEntropy - sf) / sfg;
        UI.log(`sf = ${sf}, sfg = ${sfg}, x = (${inputValues.specificEntropy} - ${sf}) / ${sfg}`);
        outputValues.quality = quality;
      }
      const quality = outputValues.quality;
      UI.log(`x = ${quality}`);
      UI.log("");
      //#endregion

      //#region find v u h s
      if (inputValues.specificVolume === null) {
        const vf = tempResult.result[propertyIndex(table, "v_sat.liquid")];
        const vfg = tempResult.result[propertyIndex(table, "v_evap.")];
        const v = vf + quality * vfg;

        UI.log("finding specific volume based on quality...");
        UI.log(`vf = ${vf}, vfg = ${vfg}, v = (${vf} + ${quality} * ${vfg})`);
        UI.log(`v = ${v}`);

        outputValues.specificVolume = v;
      }
      if (inputValues.internalEnergy === null) {
        const uf = tempResult.result[propertyIndex(table, "u_sat.liquid")];
        const ufg = tempResult.result[propertyIndex(table, "u_evap.")];
        const u = uf + quality * ufg;

        UI.log("finding internal energy based on quality...");
        UI.log(`uf = ${uf}, ufg = ${ufg}, u = (${uf} + ${quality} * ${ufg})`);
        UI.log(`u = ${u}`);

        outputValues.internalEnergy = u;
      }
      if (inputValues.specificEnthalpy === null) {
        const hf = tempResult.result[propertyIndex(table, "h_sat.liquid")];
        const hfg = tempResult.result[propertyIndex(table, "h_evap.")];
        const h = hf + quality * hfg;

        UI.log("finding specific enthalpy based on quality...");
        UI.log(`hf = ${hf}, hfg = ${hfg}, h = (${hf} + ${quality} * ${hfg})`);
        UI.log(`h = ${h}`);

        outputValues.specificEnthalpy = h;
      }
      if (inputValues.specificEntropy === null) {
        const sf = tempResult.result[propertyIndex(table, "s_sat.liquid")];
        const sfg = tempResult.result[propertyIndex(table, "s_evap.")];
        const s = sf + quality * sfg;

        UI.log("finding specific entropy based on quality...");
        UI.log(`sf = ${sf}, sfg = ${sfg}, s = (${sf} + ${quality} * ${sfg})`);
        UI.log(`s = ${s}`);

        outputValues.specificEntropy = s;
      }
      //#endregion

      return outputValues;
    } else if ((tempResult.statusCode = "300")) {
      // if didn't found exact temperature =>

      //#region find pressure
      UI.log("start interpolation to find saturated pressure");
      const pressure = interpolator(
        temp,
        tempResult.result[0][tempIndex],
        tempResult.result[1][tempIndex],
        tempResult.result[0][pressIndex],
        tempResult.result[1][pressIndex]
      );
      outputValues.pressure = pressure;
      UI.log(`saturated pressure is ${outputValues.pressure}`);
      UI.log("");
      //#endregion

      //#region find x
      if (inputValues.specificVolume) {
        UI.log("finding quality based on specific volume...");
        const vfIndex = propertyIndex(table, "v_sat.liquid");
        const vfgIndex = propertyIndex(table, "v_evap.");

        const vf = interpolator(
          temp,
          tempResult.result[0][tempIndex],
          tempResult.result[1][tempIndex],
          tempResult.result[0][vfIndex],
          tempResult.result[1][vfIndex]
        );

        const vfg = interpolator(
          temp,
          tempResult.result[0][tempIndex],
          tempResult.result[1][tempIndex],
          tempResult.result[0][vfgIndex],
          tempResult.result[1][vfgIndex]
        );

        const quality = (inputValues.specificVolume - vf) / vfg;
        UI.log(`vf = ${vf}, vfg = ${vfg}, x = (${inputValues.specificVolume} - ${vf}) / ${vfg}`);
        outputValues.quality = quality;
      }
      if (inputValues.internalEnergy) {
        UI.log("finding quality based on internal energy...");
        const ufIndex = propertyIndex(table, "u_sat.liquid");
        const ufgIndex = propertyIndex(table, "u_evap.");

        const uf = interpolator(
          temp,
          tempResult.result[0][tempIndex],
          tempResult.result[1][tempIndex],
          tempResult.result[0][ufIndex],
          tempResult.result[1][ufIndex]
        );

        const ufg = interpolator(
          temp,
          tempResult.result[0][tempIndex],
          tempResult.result[1][tempIndex],
          tempResult.result[0][ufgIndex],
          tempResult.result[1][ufgIndex]
        );

        const quality = (inputValues.internalEnergy - uf) / ufg;
        UI.log(`uf = ${uf}, ufg = ${ufg}, x = (${inputValues.internalEnergy} - ${uf}) / ${ufg}`);
        outputValues.quality = quality;
      }
      if (inputValues.specificEnthalpy) {
        UI.log("finding quality based on specific enthalpy...");
        const hfIndex = propertyIndex(table, "h_sat.liquid");
        const hfgIndex = propertyIndex(table, "h_evap.");

        const hf = interpolator(
          temp,
          tempResult.result[0][tempIndex],
          tempResult.result[1][tempIndex],
          tempResult.result[0][hfIndex],
          tempResult.result[1][hfIndex]
        );

        const hfg = interpolator(
          temp,
          tempResult.result[0][tempIndex],
          tempResult.result[1][tempIndex],
          tempResult.result[0][hfgIndex],
          tempResult.result[1][hfgIndex]
        );

        const quality = (inputValues.specificEnthalpy - hf) / hfg;
        UI.log(`hf = ${hf}, hfg = ${hfg}, x = (${inputValues.specificEnthalpy} - ${hf}) / ${hfg}`);
        outputValues.quality = quality;
      }
      if (inputValues.specificEntropy) {
        UI.log("finding quality based on specific entropy...");
        const sfIndex = propertyIndex(table, "s_sat.liquid");
        const sfgIndex = propertyIndex(table, "s_evap.");

        const sf = interpolator(
          temp,
          tempResult.result[0][tempIndex],
          tempResult.result[1][tempIndex],
          tempResult.result[0][sfIndex],
          tempResult.result[1][sfIndex]
        );

        const sfg = interpolator(
          temp,
          tempResult.result[0][tempIndex],
          tempResult.result[1][tempIndex],
          tempResult.result[0][sfgIndex],
          tempResult.result[1][sfgIndex]
        );

        const quality = (inputValues.specificEntropy - sf) / sfg;
        UI.log(`sf = ${sf}, sfg = ${sfg}, x = (${inputValues.specificEntropy} - ${sf}) / ${sfg}`);
        outputValues.quality = quality;
      }
      const quality = outputValues.quality;
      UI.log(`x = ${quality}`);
      UI.log("");
      //#endregion

      //#region find v u h s
      if (inputValues.specificVolume === null) {
        UI.log("finding specific volume based on quality...");

        const vfIndex = propertyIndex(table, "v_sat.liquid");
        const vfgIndex = propertyIndex(table, "v_evap.");

        const vf = interpolator(
          temp,
          tempResult.result[0][tempIndex],
          tempResult.result[1][tempIndex],
          tempResult.result[0][vfIndex],
          tempResult.result[1][vfIndex]
        );

        const vfg = interpolator(
          temp,
          tempResult.result[0][tempIndex],
          tempResult.result[1][tempIndex],
          tempResult.result[0][vfgIndex],
          tempResult.result[1][vfgIndex]
        );
        const v = vf + quality * vfg;

        UI.log(`vf = ${vf}, vfg = ${vfg}, v = (${vf} + ${quality} * ${vfg})`);
        UI.log(`v = ${v}`);
        UI.log("");

        outputValues.specificVolume = v;
      }
      if (inputValues.internalEnergy === null) {
        UI.log("finding internal energy based on quality...");

        const ufIndex = propertyIndex(table, "u_sat.liquid");
        const ufgIndex = propertyIndex(table, "u_evap.");

        const uf = interpolator(
          temp,
          tempResult.result[0][tempIndex],
          tempResult.result[1][tempIndex],
          tempResult.result[0][ufIndex],
          tempResult.result[1][ufIndex]
        );

        const ufg = interpolator(
          temp,
          tempResult.result[0][tempIndex],
          tempResult.result[1][tempIndex],
          tempResult.result[0][ufgIndex],
          tempResult.result[1][ufgIndex]
        );
        const u = uf + quality * ufg;

        UI.log(`uf = ${uf}, ufg = ${ufg}, u = (${uf} + ${quality} * ${ufg})`);
        UI.log(`u = ${u}`);
        UI.log("");

        outputValues.internalEnergy = u;
      }
      if (inputValues.specificEnthalpy === null) {
        UI.log("finding specific enthalpy based on quality...");
        const hfIndex = propertyIndex(table, "h_sat.liquid");
        const hfgIndex = propertyIndex(table, "h_evap.");

        const hf = interpolator(
          temp,
          tempResult.result[0][tempIndex],
          tempResult.result[1][tempIndex],
          tempResult.result[0][hfIndex],
          tempResult.result[1][hfIndex]
        );

        const hfg = interpolator(
          temp,
          tempResult.result[0][tempIndex],
          tempResult.result[1][tempIndex],
          tempResult.result[0][hfgIndex],
          tempResult.result[1][hfgIndex]
        );
        const h = hf + quality * hfg;

        UI.log(`hf = ${hf}, hfg = ${hfg}, h = (${hf} + ${quality} * ${hfg})`);
        UI.log(`h = ${h}`);
        UI.log("");

        outputValues.specificEnthalpy = h;
      }
      if (inputValues.specificEntropy === null) {
        UI.log("finding specific entropy based on quality...");

        const sfIndex = propertyIndex(table, "s_sat.liquid");
        const sfgIndex = propertyIndex(table, "s_evap.");

        const sf = interpolator(
          temp,
          tempResult.result[0][tempIndex],
          tempResult.result[1][tempIndex],
          tempResult.result[0][sfIndex],
          tempResult.result[1][sfIndex]
        );

        const sfg = interpolator(
          temp,
          tempResult.result[0][tempIndex],
          tempResult.result[1][tempIndex],
          tempResult.result[0][sfgIndex],
          tempResult.result[1][sfgIndex]
        );
        const s = sf + quality * sfg;
        UI.log(`sf = ${sf}, sfg = ${sfg}, s = (${sf} + ${quality} * ${sfg})`);
        UI.log(`s = ${s}`);
        UI.log("");

        outputValues.specificEntropy = s;
      }
      //#endregion
      return outputValues;
    }
  } else if (inputValues.pressure) {
    //#region base variables
    const table = tables["b1" + substance];
    const pressure = inputValues.pressure;
    const pressIndex = propertyIndex(table, "press.");
    const pressResult = smartSearch(table, "press.", pressure);
    const tempIndex = propertyIndex(table, "temp.");
    //#endregion

    if (pressResult.statusCode === "200") {
      //#region find saturation temperature
      outputValues.temperature = pressResult.result[tempIndex];
      UI.log(`saturated temperature is ${outputValues.temperature}`);
      UI.log("");
      //#endregion

      //#region find x
      if (inputValues.specificVolume) {
        UI.log("finding quality based on specific volume...");
        const vf = pressResult.result[propertyIndex(table, "v_sat.liquid")];
        const vfg = pressResult.result[propertyIndex(table, "v_evap.")];
        const quality = (inputValues.specificVolume - vf) / vfg;
        UI.log(`vf = ${vf}, vfg = ${vfg}, x = (${inputValues.specificVolume} - ${vf}) / ${vfg}`);
        outputValues.quality = quality;
      } else if (inputValues.internalEnergy) {
        UI.log("finding quality based on internal energy...");
        const uf = pressResult.result[propertyIndex(table, "u_sat.liquid")];
        const ufg = pressResult.result[propertyIndex(table, "u_evap.")];
        const quality = (inputValues.internalEnergy - uf) / ufg;
        UI.log(`uf = ${uf}, ufg = ${ufg}, x = (${inputValues.internalEnergy} - ${uf}) / ${ufg}`);
        outputValues.quality = quality;
      } else if (inputValues.specificEnthalpy) {
        UI.log("finding quality based on specific enthalpy...");
        const hf = pressResult.result[propertyIndex(table, "h_sat.liquid")];
        const hfg = pressResult.result[propertyIndex(table, "h_evap.")];
        const quality = (inputValues.specificEnthalpy - hf) / hfg;
        UI.log(`hf = ${hf}, hfg = ${hfg}, x = (${inputValues.specificEnthalpy} - ${hf}) / ${hfg}`);
        outputValues.quality = quality;
      } else if (inputValues.specificEntropy) {
        UI.log("finding quality based on specific entropy...");
        const sf = pressResult.result[propertyIndex(table, "s_sat.liquid")];
        const sfg = pressResult.result[propertyIndex(table, "s_evap.")];
        const quality = (inputValues.specificEntropy - sf) / sfg;
        UI.log(`sf = ${sf}, sfg = ${sfg}, x = (${inputValues.specificEntropy} - ${sf}) / ${sfg}`);
        outputValues.quality = quality;
      }
      const quality = outputValues.quality;
      UI.log(`x = ${quality}`);
      UI.log("");
      //#endregion

      //#region find v u h s
      if (inputValues.specificVolume === null) {
        const vf = pressResult.result[propertyIndex(table, "v_sat.liquid")];
        const vfg = pressResult.result[propertyIndex(table, "v_evap.")];
        const v = vf + quality * vfg;

        UI.log("finding specific volume based on quality...");
        UI.log(`vf = ${vf}, vfg = ${vfg}, v = (${vf} + ${quality} * ${vfg})`);
        UI.log(`v = ${v}`);

        outputValues.specificVolume = v;
      }
      if (inputValues.internalEnergy === null) {
        const uf = pressResult.result[propertyIndex(table, "u_sat.liquid")];
        const ufg = pressResult.result[propertyIndex(table, "u_evap.")];
        const u = uf + quality * ufg;

        UI.log("finding internal energy based on quality...");
        UI.log(`uf = ${uf}, ufg = ${ufg}, u = (${uf} + ${quality} * ${ufg})`);
        UI.log(`u = ${u}`);

        outputValues.internalEnergy = u;
      }
      if (inputValues.specificEnthalpy === null) {
        const hf = pressResult.result[propertyIndex(table, "h_sat.liquid")];
        const hfg = pressResult.result[propertyIndex(table, "h_evap.")];
        const h = hf + quality * hfg;

        UI.log("finding specific enthalpy based on quality...");
        UI.log(`hf = ${hf}, hfg = ${hfg}, h = (${hf} + ${quality} * ${hfg})`);
        UI.log(`h = ${h}`);

        outputValues.specificEnthalpy = h;
      }
      if (inputValues.specificEntropy === null) {
        const sf = pressResult.result[propertyIndex(table, "s_sat.liquid")];
        const sfg = pressResult.result[propertyIndex(table, "s_evap.")];
        const s = sf + quality * sfg;

        UI.log("finding specific entropy based on quality...");
        UI.log(`sf = ${sf}, sfg = ${sfg}, s = (${sf} + ${quality} * ${sfg})`);
        UI.log(`s = ${s}`);

        outputValues.specificEntropy = s;
      }
      //#endregion

      return outputValues;
    } else if ((pressResult.statusCode = "300")) {
      // if didn't found exact temperature =>

      //#region find temperature
      UI.log("start interpolation to find saturated temperature");
      const temperature = interpolator(
        pressure,
        pressResult.result[0][pressIndex],
        pressResult.result[1][pressIndex],
        pressResult.result[0][tempIndex],
        pressResult.result[1][tempIndex]
      );
      outputValues.temperature = temperature;
      UI.log(`saturated temperature is ${outputValues.temperature}`);
      UI.log("");
      //#endregion

      //#region find x
      if (inputValues.specificVolume) {
        UI.log("finding quality based on specific volume...");
        const vfIndex = propertyIndex(table, "v_sat.liquid");
        const vfgIndex = propertyIndex(table, "v_evap.");

        const vf = interpolator(
          pressure,
          pressResult.result[0][pressIndex],
          pressResult.result[1][pressIndex],
          pressResult.result[0][vfIndex],
          pressResult.result[1][vfIndex]
        );

        const vfg = interpolator(
          pressure,
          pressResult.result[0][pressIndex],
          pressResult.result[1][pressIndex],
          pressResult.result[0][vfgIndex],
          pressResult.result[1][vfgIndex]
        );

        const quality = (inputValues.specificVolume - vf) / vfg;
        UI.log(`vf = ${vf}, vfg = ${vfg}, x = (${inputValues.specificVolume} - ${vf}) / ${vfg}`);
        outputValues.quality = quality;
      }
      if (inputValues.internalEnergy) {
        UI.log("finding quality based on internal energy...");
        const ufIndex = propertyIndex(table, "u_sat.liquid");
        const ufgIndex = propertyIndex(table, "u_evap.");

        const uf = interpolator(
          pressure,
          pressResult.result[0][pressIndex],
          pressResult.result[1][pressIndex],
          pressResult.result[0][ufIndex],
          pressResult.result[1][ufIndex]
        );

        const ufg = interpolator(
          pressure,
          pressResult.result[0][pressIndex],
          pressResult.result[1][pressIndex],
          pressResult.result[0][ufgIndex],
          pressResult.result[1][ufgIndex]
        );

        const quality = (inputValues.internalEnergy - uf) / ufg;
        UI.log(`uf = ${uf}, ufg = ${ufg}, x = (${inputValues.internalEnergy} - ${uf}) / ${ufg}`);
        outputValues.quality = quality;
      }
      if (inputValues.specificEnthalpy) {
        UI.log("finding quality based on specific enthalpy...");
        const hfIndex = propertyIndex(table, "h_sat.liquid");
        const hfgIndex = propertyIndex(table, "h_evap.");

        const hf = interpolator(
          pressure,
          pressResult.result[0][pressIndex],
          pressResult.result[1][pressIndex],
          pressResult.result[0][hfIndex],
          pressResult.result[1][hfIndex]
        );

        const hfg = interpolator(
          pressure,
          pressResult.result[0][pressIndex],
          pressResult.result[1][pressIndex],
          pressResult.result[0][hfgIndex],
          pressResult.result[1][hfgIndex]
        );

        const quality = (inputValues.specificEnthalpy - hf) / hfg;
        UI.log(`hf = ${hf}, hfg = ${hfg}, x = (${inputValues.specificEnthalpy} - ${hf}) / ${hfg}`);
        outputValues.quality = quality;
      }
      if (inputValues.specificEntropy) {
        UI.log("finding quality based on specific entropy...");
        const sfIndex = propertyIndex(table, "s_sat.liquid");
        const sfgIndex = propertyIndex(table, "s_evap.");

        const sf = interpolator(
          pressure,
          pressResult.result[0][pressIndex],
          pressResult.result[1][pressIndex],
          pressResult.result[0][sfIndex],
          pressResult.result[1][sfIndex]
        );

        const sfg = interpolator(
          pressure,
          pressResult.result[0][pressIndex],
          pressResult.result[1][pressIndex],
          pressResult.result[0][sfgIndex],
          pressResult.result[1][sfgIndex]
        );

        const quality = (inputValues.specificEntropy - sf) / sfg;
        UI.log(`sf = ${sf}, sfg = ${sfg}, x = (${inputValues.specificEntropy} - ${sf}) / ${sfg}`);
        outputValues.quality = quality;
      }
      const quality = outputValues.quality;
      UI.log(`x = ${quality}`);
      UI.log("");
      //#endregion

      //#region find v u h s
      if (inputValues.specificVolume === null) {
        UI.log("finding specific volume based on quality...");

        const vfIndex = propertyIndex(table, "v_sat.liquid");
        const vfgIndex = propertyIndex(table, "v_evap.");

        const vf = interpolator(
          pressure,
          pressResult.result[0][pressIndex],
          pressResult.result[1][pressIndex],
          pressResult.result[0][vfIndex],
          pressResult.result[1][vfIndex]
        );

        const vfg = interpolator(
          pressure,
          pressResult.result[0][pressIndex],
          pressResult.result[1][pressIndex],
          pressResult.result[0][vfgIndex],
          pressResult.result[1][vfgIndex]
        );
        const v = vf + quality * vfg;

        UI.log(`vf = ${vf}, vfg = ${vfg}, v = (${vf} + ${quality} * ${vfg})`);
        UI.log(`v = ${v}`);
        UI.log("");

        outputValues.specificVolume = v;
      }
      if (inputValues.internalEnergy === null) {
        UI.log("finding internal energy based on quality...");

        const ufIndex = propertyIndex(table, "u_sat.liquid");
        const ufgIndex = propertyIndex(table, "u_evap.");

        const uf = interpolator(
          pressure,
          pressResult.result[0][pressIndex],
          pressResult.result[1][pressIndex],
          pressResult.result[0][ufIndex],
          pressResult.result[1][ufIndex]
        );

        const ufg = interpolator(
          pressure,
          pressResult.result[0][pressIndex],
          pressResult.result[1][pressIndex],
          pressResult.result[0][ufgIndex],
          pressResult.result[1][ufgIndex]
        );
        const u = uf + quality * ufg;

        UI.log(`uf = ${uf}, ufg = ${ufg}, u = (${uf} + ${quality} * ${ufg})`);
        UI.log(`u = ${u}`);
        UI.log("");

        outputValues.internalEnergy = u;
      }
      if (inputValues.specificEnthalpy === null) {
        UI.log("finding specific enthalpy based on quality...");
        const hfIndex = propertyIndex(table, "h_sat.liquid");
        const hfgIndex = propertyIndex(table, "h_evap.");

        const hf = interpolator(
          pressure,
          pressResult.result[0][pressIndex],
          pressResult.result[1][pressIndex],
          pressResult.result[0][hfIndex],
          pressResult.result[1][hfIndex]
        );

        const hfg = interpolator(
          pressure,
          pressResult.result[0][pressIndex],
          pressResult.result[1][pressIndex],
          pressResult.result[0][hfgIndex],
          pressResult.result[1][hfgIndex]
        );
        const h = hf + quality * hfg;

        UI.log(`hf = ${hf}, hfg = ${hfg}, h = (${hf} + ${quality} * ${hfg})`);
        UI.log(`h = ${h}`);
        UI.log("");

        outputValues.specificEnthalpy = h;
      }
      if (inputValues.specificEntropy === null) {
        UI.log("finding specific entropy based on quality...");

        const sfIndex = propertyIndex(table, "s_sat.liquid");
        const sfgIndex = propertyIndex(table, "s_evap.");

        const sf = interpolator(
          pressure,
          pressResult.result[0][pressIndex],
          pressResult.result[1][pressIndex],
          pressResult.result[0][sfIndex],
          pressResult.result[1][sfIndex]
        );

        const sfg = interpolator(
          pressure,
          pressResult.result[0][pressIndex],
          pressResult.result[1][pressIndex],
          pressResult.result[0][sfgIndex],
          pressResult.result[1][sfgIndex]
        );
        const s = sf + quality * sfg;
        UI.log(`sf = ${sf}, sfg = ${sfg}, s = (${sf} + ${quality} * ${sfg})`);
        UI.log(`s = ${s}`);
        UI.log("");

        outputValues.specificEntropy = s;
      }
      //#endregion
      return outputValues;
    }
  }
}
