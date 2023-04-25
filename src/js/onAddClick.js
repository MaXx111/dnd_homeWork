export default class OnAddClick {
  constructor(elem) {
    this._elem = elem;
    this.localStorage = {
      done: [],
      inProgress: [],
      toDo: [],
    };

    this.onClick = this.onClick.bind(this);
    this.addForm = this.addForm.bind(this);
    this.getHTMLForm = this.getHTMLForm.bind(this);
    this.onAddButton = this.onAddButton.bind(this);
    this.onCloseButton = this.onCloseButton.bind(this);
    this.addTaskLink = this.addTaskLink.bind(this);
    this.printTaskItem = this.printTaskItem.bind(this);
    this.onCloseItemClick = this.onCloseItemClick.bind(this);
    this.renderLocalStorage = this.renderLocalStorage.bind(this);
  }

  init() {
    this._elem.addEventListener('click', this.onClick);
    this._elem.addEventListener('click', this.onCloseItemClick);
    this.renderLocalStorage();

    this._elem.addEventListener('click', (e) => {
      console.log(e.target)
    });
  }

  renderLocalStorage() {
    const storage = JSON.parse(localStorage.getItem('items'));
    if (storage === '{}' || !storage) return;

    this.localStorage = storage;
    if (this.localStorage.toDo.length !== 0) {
      const elem = document.getElementById('toDo').querySelector('.task__item__wrapper');
      for (let i = 0; i < this.localStorage.toDo.length; i++) {
        this.printTaskItem(this.localStorage.toDo[i], elem);
      }
    }

    if (this.localStorage.inProgress.length !== 0) {
      const elem = document.getElementById('inProgress').querySelector('.task__item__wrapper');
      for (let i = 0; i < this.localStorage.inProgress.length; i++) {
        this.printTaskItem(this.localStorage.inProgress[i], elem);
      }
    }

    if (this.localStorage.done.length !== 0) {
      const elem = document.getElementById('done').querySelector('.task__item__wrapper');
      for (let i = 0; i < this.localStorage.done.length; i++) {
        this.printTaskItem(this.localStorage.done[i], elem);
      }
    }
  }

  onClick(e) {
    e.preventDefault();
    if (!e.target.closest('.task__add')) return;

    this.addForm(e.target.closest('.task__wrapper'));
  }

  addForm(elem) {
    const form = this.getHTMLForm();
    elem.querySelector('.task__add').remove();
    elem.insertAdjacentElement('beforeEnd', form);
    elem.querySelector('.add__button').addEventListener('click', this.onAddButton);
    elem.querySelector('.cancel__button').addEventListener('click', this.onCloseButton);
  }

  getHTMLForm() {
    const form = document.createElement('form');
    form.id = 'form';
    form.className = 'form';
    form.innerHTML = `<textarea class="textarea" name="comment" form="card"
        placeholder="Enter a title for this card..." required></textarea>
    <div class="form__buttons">
        <button form="card" class="add__button" type="submit">Add card</button>
        <button form="card" class="cancel__button" type="reset">Cancel</button>
    </div>`;

    return form;
  }

  onAddButton(e) {
    const { value } = e.target.closest('.task__wrapper').querySelector('.textarea');
    const elem = e.target.closest('.task__wrapper').querySelector('.task__item__wrapper');
    this.addTaskLink(e.target.closest('.task__wrapper'));

    const form = e.target.closest('.form');
    form.remove();
    form.querySelector('.add__button').removeEventListener('click', this.onAddButton);
    form.querySelector('.cancel__button').removeEventListener('click', this.onCloseButton);

    if (!value) return;
    this.printTaskItem(value, elem);

    const { id } = elem.closest('.task__conteiner');
    if (id) this.addLocalStorage(value, id);
  }

  onCloseButton(e) {
    this.addTaskLink(e.target.closest('.task__wrapper'));

    const form = e.target.closest('.form');
    form.remove();
    form.querySelector('.add__button').removeEventListener('click', this.onAddButton);
    form.querySelector('.cancel__button').removeEventListener('click', this.onCloseButton);
  }

  addTaskLink(elem) {
    const addLink = document.createElement('a');
    addLink.href = '#';
    addLink.className = 'task__add';
    addLink.textContent = 'add another card';
    elem.insertAdjacentElement('beforeEnd', addLink);
  }

  printTaskItem(value, elem) {
    const item = document.createElement('div');
    item.className = 'task__item';
    item.innerHTML = `<p class="item__text">${value}</p><div class="item__plus"></div>`;
    elem.insertAdjacentElement('beforeEnd', item);
  }

  onCloseItemClick(e) {
    if (e.target.className !== 'item__plus') return;

    const value = e.target.closest('.task__item').querySelector('.item__text').textContent;
    const { id } = e.target.closest('.task__conteiner');

    let index;
    if (id == 'toDo') {
      index = this.localStorage.toDo.indexOf(value);
      this.localStorage.toDo.splice(index, 1);
    }

    if (id == 'inProgress') {
      index = this.localStorage.inProgress.indexOf(value);
      this.localStorage.inProgress.splice(index, 1);
    }

    if (id == 'done') {
      index = this.localStorage.done.indexOf(value);
      this.localStorage.done.splice(index, 1);
    }

    localStorage.setItem('items', JSON.stringify(this.localStorage));
    e.target.closest('.task__item').remove();
  }

  addLocalStorage(value, id) {
    if (id === 'toDo') {
      this.localStorage.toDo.push(value);
    }

    if (id === 'inProgress') {
      this.localStorage.inProgress.push(value);
    }

    if (id === 'done') {
      this.localStorage.done.push(value);
    }

    localStorage.setItem('items', JSON.stringify(this.localStorage));
  }
}
