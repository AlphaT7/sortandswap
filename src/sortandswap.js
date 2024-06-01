const $ = document.querySelector.bind(document);

const SortAndSwap = class {
  constructor(dataObj) {
    this.container = $("#" + dataObj.containerId);
    this.dragActiveClass = dataObj.dragActiveClass;
    this.type = dataObj.sortOrSwap;
    this.storage = dataObj.useLocalStorage;
    this.dragActiveIndex = "";
  }

  dropZone(e) {
    for (const node of this.container.children) {
      if (node.contains(e.target)) return node;
    }
  }

  dragZone(i) {
    return $(`[data-sortindex='${i}']`);
  }

  getListItemsOrder() {
    let arr1 = [];
    [...this.container.children].forEach((el, i) => {
      arr1[i] = [el.dataset.sortindex];
    });
    return arr1.join(",");
  }

  setLocalStorage() {
    let str = this.getListItemsOrder();
    localStorage.setItem(this.container.id, str);
  }

  getLocalStorage() {
    return localStorage.getItem(this.container.id);
  }

  changeHandler(dropTarget, dragTarget) {
    let dragSortIndex = +dragTarget.dataset.sortindex;
    let dropSortIndex = +dropTarget.dataset.sortindex;

    let dragEl = this.container.querySelector(
      `[data-sortindex='${dragSortIndex}']`
    );
    let dropEl = this.container.querySelector(
      `[data-sortindex='${dropSortIndex}']`
    );

    let dragNodeIndex = () => {
      return [...this.container.children].findIndex(
        (el) => el.dataset.sortindex == dragSortIndex
      );
    };

    let dropNodeIndex = () => {
      return [...this.container.children].findIndex(
        (el) => el.dataset.sortindex == dropSortIndex
      );
    };

    const swap = () => {
      let index =
        this.container.children.item(dragSortIndex) ==
        this.container.children.lastElementChild
          ? null
          : dragNodeIndex();
      let dropClone = dropEl.cloneNode(true);
      this.addListeners(dropClone);
      this.container.replaceChild(dragEl, dropEl);
      let referenceNode =
        index == null ? null : this.container.children.item(index);
      this.container.insertBefore(dropClone, referenceNode);
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
    this.setLocalStorage();
  }

  exchange(e) {
    if (this.dragZone(this.dragActiveIndex) != this.dropZone(e)) {
      this.dropZone(e).classList.remove(this.dragActiveClass);
      this.changeHandler(this.dropZone(e), this.dragZone(this.dragActiveIndex));
    }
  }

  addListeners(el) {
    el.addEventListener("dragover", (e) => {
      e.preventDefault();
      this.dropZone(e).classList.add(this.dragActiveClass);
    });
    el.addEventListener("dragstart", (e) => {
      this.dragActiveIndex = this.dropZone(e).dataset.sortindex;
      if (this.dragZone(this.dragActiveIndex) != this.dropZone(e)) {
        e.dataTransfer.setData(
          "text/plain",
          this.dropZone(e).dataset.sortindex
        );
        el.classList.add(this.dragActiveClass);
      }
    });
    el.addEventListener("dragenter", (e) => {
      e.preventDefault();
      if (this.type == "sort") this.exchange(e);
    });
    el.addEventListener("dragleave", (e) => {
      this.dropZone(e).classList.remove(this.dragActiveClass);
    });
    el.addEventListener("dragend", (e) => {
      this.dropZone(e).classList.remove(this.dragActiveClass);
    });
    el.addEventListener("drop", (e) => {
      e.preventDefault();
      if (this.type == "swap") this.exchange(e);
    });
  }

  init() {
    [...this.container.children].forEach((el, i) => {
      el.setAttribute("draggable", true);
      el.dataset.sortindex = i;
      this.addListeners(el);
    });

    if (this.storage) {
      let storageData = localStorage.getItem(this.container.id);
      if (storageData == null) {
        this.setLocalStorage();
      } else {
        let order = storageData.split(",");
        let children = [...this.container.children];
        let nodeList = [];
        for (let i = 0; i < children.length; i++) {
          nodeList.push(children[order[i]]);
        }
        this.container.innerHTML = "";
        nodeList.forEach((el) => this.container.append(el));
      }
    }
  }
};
