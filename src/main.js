import SortAndSwap from "./sortandswap.js";

let sort = new SortAndSwap({
  containerId: "container",
  dragActiveClass: "dragActive",
  sortOrSwap: "swap",
  useLocalStorage: true,
});

sort.init();
