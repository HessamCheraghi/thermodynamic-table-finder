import UI from "../view/index.js";
import rounder from "./rounder.js";
import tables from "../model/data.js";
import phaseFinder from "./phaseFinder/index.js";
import propertyFinder from "./propertyFinder/index.js";

export default function (inputValues) {
  document.querySelector("pre").textContent = "";

  const phase = phaseFinder(tables, inputValues);

  const outputValues = propertyFinder(tables, phase, inputValues);

  UI.update(rounder(outputValues));
}
