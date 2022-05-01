import tables from "../model/data.js";
import phaseFinder from "./phaseFinder/index.js";
import twoDimensionalSearch from "./twoDimensionalSearch/index.js";

export default function (inputValues) {
  // const phase = phaseFinder(tables, inputValues);
  // console.log(phase);

  //test data

  const a = [tables.b13, "press.", 35, "temp.", 125];

  //real data
  const b = [tables.b14, "press.", 4648.7, "s", 1.4241];
  const c = [tables.b52, "temp.", 13, "v", 0.3];
  const d = [tables.b52, "press.", 1160.2, "s", 1.7354];
  const res = twoDimensionalSearch(...a);
  console.log(res);
}
