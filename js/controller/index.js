import tables from "../model/data.js";
import phaseFinder from "./phaseFinder/index.js";
import twoDimensionalSearch from "./twoDimensionalSearch/index.js";
export default function (inputValues) {
  //const phase = phaseFinder(tables, inputValues);
  const a = [tables.b13, 25, "temp.", 50];
  twoDimensionalSearch(...a);
}
