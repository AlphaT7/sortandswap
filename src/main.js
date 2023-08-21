import SortAndSwap from "./sortandswap.js";

let sort = new SortAndSwap({
  containerId: "container",
  dragActiveClass: "dragActive",
  sortOrSwap: "sort",
  useLocalStorage: true,
});

sort.init();
