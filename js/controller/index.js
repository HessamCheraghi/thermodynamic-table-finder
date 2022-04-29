import tables from "../model/data.js";
import phaseFinder from "./phaseFinder/index.js";
export default function (inputValues) {
  phaseFinder(tables, inputValues);
}
