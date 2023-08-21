const log = console.log.bind(console);
const $ = document.querySelector.bind(document);

class SortAndSwap {
  #container;
  #sameEl;
  #sortOrder;
  #stepCount = 0;
  #mouse = { x: 0, y: 0 };
  #elStartPoint = { x: 0, y: 0 };
  #dragDisplayProperty;
  #dragWidthProperty;
  #dragHeightProperty;
  #dragEl = undefined;
  #cloneOrigin = undefined;
  #dragInMotion = false;

  constructor(dataObj) {
    this.#container = $("#" + dataObj.containerId);
    this.#sortOrder = [];
  }

  #addListeners() {
    [...this.#container.children].forEach((el, i) => {
      el.dataset.sortindex = i;
      el.addEventListener("mousedown", (e) => this.#mouseDownHandler(e, el));
      el.addEventListener("mouseover", (e, el) =>
        this.#mouseOverHandler(e, el)
      );
      el.style.translate = "0px 0px";
      el.style.transition = "translate 0.35s ease-out";
    });
  }

  #isInBoundary(e, el) {
    const b = el.getBoundingClientRect();
    return e.x >= b.left && e.x <= b.right && e.y >= b.top && e.y <= b.bottom;
  }

  #updateSortOrder = (i1, i2) => {
    let sortOrderClone = structuredClone(this.#sortOrder);
    let i1Clone = structuredClone(this.#sortOrder)[i1].index;
    let i2Clone = structuredClone(this.#sortOrder)[i2].index;
    //this.#sortOrder[i1].x = this.#sortOrder[i2].x;
    //this.#sortOrder[i1].y = objClone2.y;
    this.#sortOrder[i1].index = i2Clone;

    // this.#sortOrder[i2].x = objClone1.x;
    //this.#sortOrder[i2].y = objClone1.y;
    this.#sortOrder[i2].index = i1Clone;
    log(this.#sortOrder);
    //this.#sortOrder.sort((a, b) => a.index - b.index);
  };

  #updateDom() {
    let nodeList = [];
    this.#sortOrder.forEach((el) => {
      nodeList.push($(`[data-sortindex="${el.index}"]`).cloneNode(true));
    });
    this.#container.innerHTML = "";
    nodeList.forEach((el) => {
      this.#container.append(el);
    });

    this.#addListeners();
  }

  #mouseMoveHandler(e) {
    /* handling of mouse movement over other #container children */
    if (!this.#dragInMotion) return;
    [...this.#container.children].forEach((el, i, arr) => {
      // if it's on the last element in the array, exit because it's the drag ghost element;
      if (i == arr.length - 1) return;
      // if the dragged clone is over the original element that was cloned for dragging, exit;
      if (el.dataset.sortindex == this.#cloneOrigin.dataset.sortindex) return;
      // if is is not in one of the container elements boundaries, then exit;
      if (!this.#isInBoundary(e, el)) return;

      let prevStep = this.#stepCount;

      if (this.#sameEl != el) {
        this.#sameEl = el;
        this.#stepCount++;
      }

      // exit if it is multiple mouse move events on the same pair of elements
      if (prevStep == this.#stepCount || this.#stepCount < 1) return;

      let el1 = el,
        el2 = this.#cloneOrigin,
        el1X = el1.style.width,
        el1Y =
          parseInt(getComputedStyle(el1).height) +
          parseInt(getComputedStyle(el1).marginTop),
        el2X = el2.style.width,
        el2Y =
          parseInt(getComputedStyle(el2).height) +
          parseInt(getComputedStyle(el2).marginTop),
        I1 = this.#sortOrder.find((i) => i.index == el1.dataset.sortindex),
        I2 = this.#sortOrder.find((i) => i.index == el2.dataset.sortindex);

      if (e.y < this.#mouse.y) {
        log("up");
        el1.style.translate = "0px " + el1Y + "px";
        el2.style.translate =
          "0px " + (-el2Y - el2Y * (I2.index - I1.index - 1)) + "px";
        this.#updateSortOrder(I1.index, I2.index);
      } else if (e.y > this.#mouse.y) {
        log("down");
        //el1.style.translate = "0px " + -el1Y + "px";
        //el2.style.translate = "0px " + (el2Y + el2Y * (I1.index - 1)) + "px";
        //this.#updateSortOrder(I2, I1);
      }
    });

    /* handling of the drag ghost element movement */
    if (this.#dragEl == undefined || !this.#dragInMotion) return;
    this.#dragEl.style.display = this.#dragDisplayProperty;
    this.#dragEl.style.width = this.#dragWidthProperty;
    this.#dragEl.style.height = this.#dragHeightProperty;

    const offSetX = e.x - this.#mouse.x;
    const offSetY = e.y - this.#mouse.y;

    this.#dragEl.style.left = this.#elStartPoint.x + offSetX + "px";
    this.#dragEl.style.top = this.#elStartPoint.y + offSetY + "px";
  }

  #mouseOverHandler(e, el) {}

  #mouseDownHandler(e, el) {
    this.#cloneOrigin = el;
    let clone = el.cloneNode(true);
    clone.classList.add("dragActive");
    clone.style.left = el.offsetLeft;
    clone.style.top = el.offsetTop;
    clone.dataset.sortindex = [...this.#container.children].length;

    this.#dragDisplayProperty = getComputedStyle(el).display;
    this.#dragWidthProperty = getComputedStyle(el).width;
    this.#dragHeightProperty = getComputedStyle(el).height;

    el.parentElement.append(clone);

    this.#dragEl = clone;
    this.#dragInMotion = true;
    this.#mouse.x = e.x;
    this.#mouse.y = e.y;
    this.#elStartPoint.x = el.offsetLeft;
    this.#elStartPoint.y = el.offsetTop;
  }

  #mouseUpHandler() {
    if (this.#dragInMotion) {
      this.#container.removeChild(this.#dragEl);
      this.#updateDom();
      this.#stepCount = 0;
      this.#dragInMotion = false;
      this.#sameEl = undefined;
      this.#dragEl = undefined;
    }
  }

  init() {
    this.#container.style.position = "relative";
    [...this.#container.children].forEach((el, i) => {
      el.dataset.sortindex = i;
      el.addEventListener("mousedown", (e) => this.#mouseDownHandler(e, el));
      el.addEventListener("mouseover", (e, el) =>
        this.#mouseOverHandler(e, el)
      );
      el.style.translate = "0px 0px";
      el.style.transition = "translate 0.35s ease-out";
      this.#sortOrder.push({
        index: i,
        indexOrigin: i,
        x: el.offsetLeft,
        y: el.offsetTop,
      });
    });
    document.addEventListener("mousemove", (e) => this.#mouseMoveHandler(e));
    document.addEventListener("mouseup", () => this.#mouseUpHandler());
  }
}

export default SortAndSwap;
