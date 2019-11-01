/* Made with love by @fitri
 This is a component of my ReactJS project
 https://codepen.io/fitri/full/oWovYj/ */

export class DragSort {
  constructor() {}

  enableDragSort(listClass) {
    const sortableLists = document.getElementsByClassName(listClass);
    Array.prototype.map.call(sortableLists, list => {
      this.enableDragList(list);
    });
  }

  enableDragList(list) {
    Array.prototype.map.call(list.children, item => {
      this.enableDragItem(item);
    });
  }

  enableDragItem(item) {
    item.setAttribute('draggable', true);
    item.ondrag = this.handleDrag;
    item.ondragend = this.handleDrop;
  }

  handleDrag(item) {
    const selectedItem = item.target,
      list = selectedItem.parentNode,
      x = item.clientX,
      y = item.clientY;

    selectedItem.classList.add('drag-sort-active');
    let swapItem =
      document.elementFromPoint(x, y) === null
        ? selectedItem
        : document.elementFromPoint(x, y);

    if (list === swapItem.parentNode) {
      swapItem =
        swapItem !== selectedItem.nextSibling ? swapItem : swapItem.nextSibling;
      list.insertBefore(selectedItem, swapItem);
    }
  }

  handleDrop(item) {
    item.target.classList.remove('drag-sort-active');
  }
}
