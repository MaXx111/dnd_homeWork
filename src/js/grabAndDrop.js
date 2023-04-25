import OnAddClick from './onAddClick.js';

export default class GrabAndDrop {
  constructor(elem, forAddClick) {
    this._elem = elem;
    this.actualItem = undefined;
    this.target = false;
    this.margin = false;

    this.onAddClick = new OnAddClick(forAddClick);
    this.forAddClick = forAddClick;
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.editLocalStorage = this.editLocalStorage.bind(this);
  }

  init() {
    this._elem.addEventListener('mousedown', this.onMouseDown);
    this.onAddClick.init();
  }

  onMouseDown(e) {
    if (!e.target.closest('.task__item')) return;
    if (e.target.className == 'item__plus') return;
    e.preventDefault();

    this.actualItem = e.target.closest('.task__item');
    this.actualItem.classList.add('dragged');
    document.body.style.cursor = 'grabbing';

    this._elem.addEventListener('mouseup', this.onMouseUp);
    this._elem.addEventListener('mousemove', this.onMouseMove);
  }

  onMouseUp(e) {
    this.actualItem.classList.remove('dragged');
    this.actualItem.style.removeProperty('left');
    this.actualItem.style.removeProperty('top');

    const idForRemove = this.actualItem.closest('.task__conteiner').id;
    const valueForRemove = this.actualItem.querySelector('.item__text').textContent;

    this._elem.removeEventListener('mouseup', this.onMouseUp);
    this._elem.removeEventListener('mousemove', this.onMouseMove);

    if (e.target.closest('.task__wrapper')) {
      const mouseUpItem = e.target.closest('.task__item');
      const conteiner = e.target.closest('.task__wrapper').querySelector('.task__item__wrapper');

      conteiner.insertBefore(this.actualItem, mouseUpItem);

      this.editLocalStorage(idForRemove, e.target.closest('.task__conteiner').id, valueForRemove);
    }

    if (this.target) this.target.style.removeProperty('padding-top');

    this.actualItem = undefined;
    if (this.margin) {
      this.margin.remove();
      this.margin = false;
    }
    this.target = false;
    document.body.style.removeProperty('cursor');
  }

  onMouseMove(e) {
    this.actualItem.style.left = `${e.pageX - this.actualItem.offsetWidth / 2}px`;
    this.actualItem.style.top = `${e.pageY - this.actualItem.offsetHeight / 2}px`;

    if (!e.target.closest('.task__conteiner') && this.margin) {
      this.margin.remove();
    }

    if (!e.target.closest('.task__item')) return;

    if (this.target) {
      this.margin.remove();
    }

    this.target = e.target.closest('.task__item');
    const margin = document.createElement('div');
    margin.className = 'margin';
    this.margin = margin;
    this.target.insertAdjacentElement('beforeBegin', margin);
  }

  editLocalStorage(idForRemove, idToAdd, valueForRemove) {
    let index;

    if (idForRemove == 'toDo') {
      index = this.onAddClick.localStorage.toDo.indexOf(valueForRemove);
      this.onAddClick.localStorage.toDo.splice(index, 1);
    }

    if (idForRemove == 'inProgress') {
      index = this.onAddClick.localStorage.inProgress.indexOf(valueForRemove);
      this.onAddClick.localStorage.inProgress.splice(index, 1);
    }

    if (idForRemove == 'done') {
      index = this.onAddClick.localStorage.done.indexOf(valueForRemove);
      this.onAddClick.localStorage.done.splice(index, 1);
    }

    this.onAddClick.addLocalStorage(valueForRemove, idToAdd);

    localStorage.setItem('items', JSON.stringify(this.onAddClick.localStorage));
  }
}
