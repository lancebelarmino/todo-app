class Storage {
  constructor(itemList) {
    this.itemList = itemList;
    this.items = JSON.parse(localStorage.getItem(itemList)) || [];
  }

  getItems() {
    return this.items;
  }

  addItem(newItem) {
    // If item does not exist, add item to list
    if (!this.items.some(item => item.id === newItem.id)) {
      this.items.push(newItem);
      localStorage.setItem(this.itemList, JSON.stringify(this.items));
    }
  }

  updateItem(itemToUpdate) {
    this.items.forEach((item, index) => {
      if (item.id === itemToUpdate.id) {
        this.items.splice(index, 1, itemToUpdate);
        localStorage.setItem(this.itemList, JSON.stringify(this.items));
      }
    });
  }

  deleteItem(itemToDelete) {
    const items = this.items;

    items.forEach(index => {
      if (item => item.id === itemToDelete.id) {
        items.splice(index, 1);

        localStorage.setItem(this.itemList, JSON.stringify(items));
      }
    });
  }

  deleteItemList() {
    localStorage.removeItem(this.itemList);
  }
}



class TodoModel {
  constructor() {
    this.storage = new Storage('Todo');
    this.todo = this.storage.getItems();
  }

  getTodo(todoType) {
    if (todoType === 'all') {
      return this.todo;
    } else if (todoType === 'active') {
      return this.todo.filter(task => !task.isCompleted);
    } else if (todoType === 'completed') {
      return this.todo.filter(task => !task.isCompleted);
    }
  }

  addTodo(newTodo) {
    const idGenerator = this.generateId();

    const todo = {
      id: idGenerator.next().value,
      task: newTodo,
      isCompleted: false
    }

    this.storage.addItem(todo);

    return todo;
  }

  updateTodo(todoId) {
    const todoParsedId = parseInt(todoId);

    this.todo.forEach(task => {
      if (task.id === todoParsedId) {
        if (task.isCompleted === false) {
          task.isCompleted = true;
        } else {
          task.isCompleted = false;
        }
        
        this.storage.updateItem(task);
      }
    });
  }

  // Helpers
  * generateId() {
    let id = this.todo.length;
    
    while(true) {
      yield id;
      id++;
    }
  }
}



class TodoView {
  constructor() {
    this.addBtn = document.querySelector('.js-addBtn');
    this.todoInput = document.querySelector('.js-todoInput');
    this.taskGroup = document.querySelector('.js-taskGroup');
    
    this.allTabBtn = document.querySelector('.tab__link[data-tab="all"]');
    this.activeTabBtn = document.querySelector('.tab__link[data-tab="active"]');
    this.completedTabBtn = document.querySelector('.tab__link[data-tab="completed"]');

    this.todoListAll = document.querySelector('.task-list[data-tab="all"]');
    this.todoListActive = document.querySelector('.task-list[data-tab="active"]');
    this.todoListCompleted = document.querySelector('.task-list[data-tab="completed"]');
  }

  // Create Elements
  createTodo(todo) {
    const element = document.createElement('li');

    element.classList.add('task-list__item', 'js-taskItem');

    element.setAttribute('data-id', `${todo.id}`);

    if (todo.isCompleted === false || todo.isCompleted === undefined) {
      element.innerHTML = `
      <div class="task-list__content">
        <div class="checkbox">
          <input type="checkbox" id="vehicle1" class="task-list__checkbox">
          
          <button class="btn btn__checkbox js-checkbox" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="13" fill="none" xmlns:v="https://vecta.io/nano">
              <path d="M17 1L6 12L1 7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>

        <p class="task-list__detail js-listDetail">${todo.task}</p>
      </div>
    `;
    } else {
      element.innerHTML = `
      <div class="task-list__content">
        <div class="checkbox">
          <input type="checkbox" id="vehicle1" class="task-list__checkbox">
          
          <button class="btn btn__checkbox checked js-checkbox" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="13" fill="none" xmlns:v="https://vecta.io/nano">
              <path d="M17 1L6 12L1 7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>

        <p class="task-list__detail task-list__detail--completed js-listDetail">${todo.task}</p>
      </div>
      
      <button class="btn btn__delete js-delete">
        <span>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="22" fill="none" xmlns:v="https://vecta.io/nano">
            <path d="M1 5h2m0 0h16M3 5v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V5H3zm3 0V3a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m-6 5v6m4-6v6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
      </button>
    `;
    }

    return element;
  }

  // UI Changes
  updateTodo(todoElement) {
    const checkbox = todoElement.querySelector('.js-checkbox');
    const todoText = todoElement.querySelector('.js-listDetail');

    checkbox.classList.toggle('checked');
    todoText.classList.toggle('task-list__detail--completed');
  }

  setActiveTab(tabName) {
    const allTabBtn = document.querySelectorAll('.tab__link');

    allTabBtn.forEach(btn => btn.classList.remove('tab__link--active'));

    if (tabName === 'all') {
      this.allTabBtn.classList.add('tab__link--active');
    } else if (tabName === 'active') {
      this.activeTabBtn.classList.add('tab__link--active')
    } else if (tabName === 'completed') {
      this.completedTabBtn.classList.add('tab__link--active')
    }
  }

  clearTodo() {
    this.todoListAll.innerHTML = ``;
    this.todoListActive.innerHTML = ``;
    this.todoListCompleted.innerHTML = ``;
  }

  clearField() {
    this.todoInput.value = '';
  }

  // Todo Events
  onAddTodo(handler) {
    this.addBtn.addEventListener('click', e => {
      e.preventDefault();

      const todoInputValue = document.querySelector('.js-todoInput').value;

      if (todoInputValue) {
        const newTodo = handler(todoInputValue);

        this.renderNewTodo(newTodo);
        this.clearField();
      }
    });
  }

  onCheckboxClick(handler) {
    this.taskGroup.addEventListener('click', e => {
      const todoElement = e.target.parentElement.parentElement.parentElement;
      const todoId = e.target.parentElement.parentElement.parentElement.getAttribute('data-id');

      if (e.target.classList.contains('js-checkbox')) {
        handler(todoId);
        this.updateTodo(todoElement);
      }
    });
  }

  // Tab Events
  onAllTabClick(handler) {
    this.allTabBtn.addEventListener('click', e => {
      const todoList = handler('all');

      this.setActiveTab('all');
      this.clearTodo();
      this.renderTodo(todoList, 'all');
    });
  }

  onActiveTabClick(handler) {
    this.activeTabBtn.addEventListener('click', e => {
      const todoList = handler('active');

      this.setActiveTab('active');
      this.clearTodo();
      this.renderTodo(todoList, 'active');
    });
  }

  onCompletedTabClick(todoList) {
    this.completedTabBtn.addEventListener('click', e => {
      const todoList = handler('completed');

      this.setActiveTab('completed');
      this.clearTodo();
      this.renderTodo(todoList, 'completed');
      this.renderCompletedUI();
    });
  }

  // Render Elements
  renderTodo(todoList, tabName) {
    todoList.forEach(task => {
      const todo = this.createTodo(task);

      if (tabName === 'all') {
        this.todoListAll.append(todo);
      } else if (tabName === 'active') {
        this.todoListActive.append(todo);
      } else if (tabName === 'completed') {
        this.todoListCompleted.append(todo);
      }
    });
  }

  renderNewTodo(newTodo) {
    const todo = this.createTodo(newTodo);
    const activeTab = document.querySelector('.tab__link--active').getAttribute('data-tab');
    
    if (activeTab === 'all') {
      this.todoListAll.append(todo);
    } else if (activeTab === 'active') {
      this.todoListActive.append(todo);
    }
  }

  renderCompletedUI() {
    const todoList = document.querySelectorAll('.js-delete');

    todoList.forEach(task => {
      console.log(task);
      task.classList.add('btn__delete--visible')
  });
  }

  // Initialize
  init(items) {
    this.renderTodo(items, 'all');
  }
}



class TodoController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.todoAll = this.getTodo('all');
  }

  getTodo(todoType) {
    return this.model.getTodo(todoType);
  }

  handleEventListeners() {
    this.view.onAddTodo(this.handleAddTodo);
    this.view.onCheckboxClick(this.handleCheckboxClick);
    this.view.onAllTabClick(this.handleOnTabClick);
    this.view.onActiveTabClick(this.handleOnTabClick);
    this.view.onCompletedTabClick(this.handleOnTabClick);
  }

  handleAddTodo = newTodo => {
    return this.model.addTodo(newTodo);
  }

  handleCheckboxClick = todoId => {
    this.model.updateTodo(todoId);
  }

  handleOnTabClick = todoType => {
    return this.model.getTodo(todoType);
  }

  init() {
    this.view.init(this.todoAll);
    this.handleEventListeners();
  }
}

const todo = new TodoController(new TodoModel(), new TodoView());

todo.init();