const log = console.log.bind(console);
const $ = document.querySelector.bind(document);

class SortAndSwap {
  #container;
  #sameEl;
  #domNodeList = [];
  #sortOrder = [];
  #stepCount = 0;
  #currentDragIndex = undefined;
  #currentDropIndex = undefined;
  #pointer = { x: 0, y: 0 };
  #elStartPoint = { x: 0, y: 0 };
  #dragDisplayProperty;
  #dragWidthProperty;
  #dragHeightProperty;
  #dragEl = undefined;
  #cloneOrigin = undefined;
  #dragInMotion = false;

  constructor(dataObj) {
    this.#container = $("#" + dataObj.containerId);
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

  #updateSortOrder = (x, y) => {
    let tempDragNode =
      this.#domNodeList[this.#currentDragIndex].cloneNode(true);
    let tempDropNode =
      this.#domNodeList[this.#currentDropIndex].cloneNode(true);

    if (y < 0) {
      this.#domNodeList.splice(this.#currentDragIndex, 1);
      this.#domNodeList.splice(this.#currentDropIndex, 0, tempDragNode);
    } else {
      this.#domNodeList.splice(this.#currentDragIndex, 1);
      this.#domNodeList.splice(this.#currentDropIndex, 0, tempDragNode);
    }

    // this.#domNodeList.forEach((el) => {
    //   log(el.innerText);
    // });

    this.#currentDragIndex = this.#currentDropIndex;
    this.#currentDropIndex = this.#domNodeList.findIndex(
      (el) => el.innerHTML == tempDropNode.innerHTML
    );
  };

  #updateDom() {
    this.#container.innerHTML = "";
    this.#domNodeList.forEach((el) => {
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

      let dropOriginEl = el;
      let dragOriginEl = this.#cloneOrigin;

      let el1X = dropOriginEl.style.width;
      let dropElHeight =
        parseInt(getComputedStyle(dropOriginEl).height) +
        parseInt(getComputedStyle(dropOriginEl).marginTop) +
        parseInt(getComputedStyle(dropOriginEl).marginBottom);
      let el2X = dragOriginEl.style.width;
      let dragElHeight =
        parseInt(getComputedStyle(dragOriginEl).height) +
        parseInt(getComputedStyle(dragOriginEl).marginTop) +
        parseInt(getComputedStyle(dragOriginEl).marginBottom);

      this.#currentDropIndex = this.#domNodeList.findIndex(
        (el) => dropOriginEl.innerHTML == el.innerHTML
      );
      this.#currentDragIndex = this.#domNodeList.findIndex(
        (el) => dragOriginEl.innerHTML == el.innerHTML
      );

      let dragOriginElIndex = [...this.#container.children].findIndex(
        (el) => el.innerHTML == dragOriginEl.innerHTML
      );

      if (e.y < this.#pointer.y) {
        log("up");

        // el2.style.translate = "0px " + (-el2Y - el2Y * (I2 - I1 - 1)) + "px";
        log(
          -dragElHeight -
            dragElHeight * (dragOriginElIndex - this.#currentDragIndex)
        );
        dropOriginEl.style.translate = "0px " + dropElHeight + "px";
        dragOriginEl.style.translate =
          "0px " +
          (
            -dragElHeight -
            dragElHeight * (dragOriginElIndex - this.#currentDragIndex)
          ).toString() +
          "px";
      } else if (e.y > this.#pointer.y) {
        log("down");

        dropOriginEl.style.translate = "0px " + -dropElHeight + "px";
        dragOriginEl.style.translate =
          "0px " +
          (dragElHeight + dragElHeight * (this.#currentDropIndex - 1)) +
          "px";
      }

      this.#updateSortOrder(0, e.y);
    });

    /* handling of the drag ghost element movement */
    if (this.#dragEl == undefined || !this.#dragInMotion) return;
    this.#dragEl.style.display = this.#dragDisplayProperty;
    this.#dragEl.style.width = this.#dragWidthProperty;
    this.#dragEl.style.height = this.#dragHeightProperty;

    const offSetX = e.x - this.#pointer.x;
    const offSetY = e.y - this.#pointer.y;

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
    this.#pointer.x = e.x;
    this.#pointer.y = e.y;
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
      this.#domNodeList.push(el.cloneNode(true));
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
