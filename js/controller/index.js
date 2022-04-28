import tables from "../model/data.js";
import stateFinder from "./stateFinder/index.js";
export default function (inputValues) {
  stateFinder(tables, inputValues);
}
