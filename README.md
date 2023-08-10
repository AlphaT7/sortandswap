![Logo](https://alphat7.github.io/sortandswap/src/images/logo.png)

# Sort And Swap

SortAndSwap.js is an open source project designed to make drag & drop list sorting or swapping easy on any screen. (Chrome/Edge/Safari)

## Usage/Examples

### Options

```javascript
{
  containerId: String, // string containing the HTML Id attribute of the list items parent element
  dragActiveClass: String, // string containing the CSS className of for drag-active list items
  sortOrSwap: String, // string clarifying either "sort" or "swap" functionality
  useLocalStorage: Boolean, // boolean to enable loading the last used order from LocalStorage on page load
}
```

### Sort Example:

```javascript
import SortAndSwap from "/path/to/sortandswap.js";

let sortList = new SortAndSwap({
  containerId: "container",
  dragActiveClass: "dragActive",
  sortOrSwap: "sort",
  useLocalStorage: false,
});

sortList.init();
```

### Swap Example:

```javascript
import SortAndSwap from "./sortandswap.js";

let swapList = new SortAndSwap({
  containerId: "container",
  dragActiveClass: "dragActive",
  sortOrSwap: "swap",
  useLocalStorage: false,
});

swapList.init();
```

## Demo

https://alphat7.github.io/sortandswap/src/index.html

## Authors

- [@AlphaT7](https://github.com/AlphaT7)

## License

[MIT](https://choosealicense.com/licenses/mit/)
