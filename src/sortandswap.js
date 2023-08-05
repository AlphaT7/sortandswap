const log = console.log.bind(console);
const $ = document.querySelector.bind(document);

const SortAndSwap = class {
  constructor(containerId, dragActiveClass, sortOrSwap) {
    this.container = "#" + containerId;
    this.dragActiveClass = dragActiveClass;
    this.type = sortOrSwap;
  }

  dropZone(e) {
    for (const node of container.children) {
      if (node.contains(e.target)) return node;
    }
  }

  dragZone(i) {
    return $(`[data-sortindex='${i}']`);
  }

  addListeners(el) {
    el.addEventListener("dragover", (e) => {
      e.preventDefault();
      this.dropZone(e).classList.add(this.dragActiveClass);
    });
    el.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", this.dropZone(e).dataset.sortindex);
    });
    el.addEventListener("dragleave", (e) => {
      this.dropZone(e).classList.remove(this.dragActiveClass);
    });
    el.addEventListener("dragend", (e) => {
      this.dropZone(e).classList.remove(this.dragActiveClass);
    });
    el.addEventListener("drop", (e) => {
      e.preventDefault();
      let i = e.dataTransfer.getData("text/plain");
      this.dropZone(e).classList.remove(this.dragActiveClass);
      this.dropHandler(this.dropZone(e), this.dragZone(i));
    });
  }

  dropHandler(dropTarget, dragTarget) {
    let dragSortIndex = +dragTarget.dataset.sortindex;
    let dropSortIndex = +dropTarget.dataset.sortindex;

    let dragEl = $(`[data-sortindex='${dragSortIndex}']`);
    let dropEl = $(`[data-sortindex='${dropSortIndex}']`);

    let dragNodeIndex = () => {
      return [...container.children].findIndex(
        (el) => el.dataset.sortindex == dragSortIndex
      );
    };

    let dropNodeIndex = () => {
      return [...container.children].findIndex(
        (el) => el.dataset.sortindex == dropSortIndex
      );
    };

    const swap = () => {
      let index =
        container.children.item(dragSortIndex) ==
        container.children.lastElementChild
          ? null
          : dragNodeIndex();
      let dropClone = dropEl.cloneNode(true);
      this.addListeners(dropClone);
      container.replaceChild(dragEl, dropEl);
      let referenceNode = index == null ? null : container.children.item(index);
      container.insertBefore(dropClone, referenceNode);
    };

    const sort = () => {
      if (dragNodeIndex() < dropNodeIndex()) {
        dropEl.after(dragEl);
      } else {
        dropEl.before(dragEl);
      }
    };

    const orderBy = {
      sort: sort,
      swap: swap,
    };

    orderBy[this.type]();
  }

  init() {
    [...container.children].forEach((el, i) => {
      el.setAttribute("draggable", true);
      el.dataset.sortindex = i;
      this.addListeners(el);
    });
  }
};

export default SortAndSwap;
