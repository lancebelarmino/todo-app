class Storage {
  constructor(itemList) {
    this.itemList = itemList;
  }

  getItems() {
    let items;

    if (localStorage.getItem(this.itemList) === null) {
      items = [];
    } else {
      items = JSON.parse(localStorage.getItem(this.itemList));
    }
    
    return items;
  }

  addItem(newItem) {
    const items = this.getItems();

    // If item does not exist, add item to list
    if (!items.some(item => item.id === newItem.id)) {
      items.push(newItem);
      localStorage.setItem(this.itemList, JSON.stringify(items));
    }
  }

  updateItem(itemToUpdate) {
    const items = this.getItems();

    items.forEach((item, index) => {
      if (item.id === itemToUpdate.id) {
        items.splice(index, 1, itemToUpdate);
        localStorage.setItem(this.itemList, JSON.stringify(items));
      }
    });
  }

  deleteItem(itemToDelete) {
    const items = this.getItems();

    items.forEach((item, index) => {
      if (item.id === itemToDelete.id) {
        items.splice(index, 1);
        localStorage.setItem(this.itemList, JSON.stringify(items));
      }
    });
  }

  deleteMultipleItems(itemArr) {
    localStorage.setItem(this.itemList, JSON.stringify(itemArr));
  }

  deleteList() {
    localStorage.removeItem(this.itemList);
  }
}



class TodoModel {
  constructor() {
    this.storage = new Storage('Todo');
  }

  getTodo(todoType) {
    const todoArr = this.storage.getItems();

    if (todoType === 'all') {
      return todoArr;
    } else if (todoType === 'active') {
      return todoArr.filter(task => !task.isCompleted);
    } else if (todoType === 'completed') {
      return todoArr.filter(task => task.isCompleted);
    }
  }

  addTodo(newTodo) {
    const newId = this.idGenerator();

    const todo = {
      id: newId,
      task: newTodo,
      isCompleted: false
    }

    this.storage.addItem(todo);

    return todo;
  }

  updateTodo(todoId) {
    const todoArr = this.storage.getItems();
    const todoParsedId = parseInt(todoId);

    todoArr.forEach(task => {
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

  deleteTodo(todoId) {
    const todoArr = this.storage.getItems();
    const todoParsedId = parseInt(todoId);

    todoArr.forEach(task => {
      if (task.id === todoParsedId) {
        this.storage.deleteItem(task);
      }
    });
  }

  deleteAllTodo() {
    const todoArr = this.storage.getItems();
    const filteredArr = todoArr.filter(task => task.isCompleted !== true);
    
    this.storage.deleteMultipleItems(filteredArr);
  }

  // Helpers
  idGenerator() {
    const todoArr = this.storage.getItems();
    const lastTask = todoArr.pop();
    
    if (lastTask === undefined) {
      return 0;
    } else {
      const id = lastTask.id + 1;
      return id;
    }
  }
}



class TodoView {
  constructor() {}

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
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="22" fill="none" xmlns:v="https://vecta.io/nano">
          <path d="M1 5h2m0 0h16M3 5v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V5H3zm3 0V3a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m-6 5v6m4-6v6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
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

  deleteTodo(todoElement) {
    todoElement.remove();
  }

  setActiveTab(tabName) {
    const allTabBtn = document.querySelector('.tab__link[data-tab="all"]');
    const activeTabBtn = document.querySelector('.tab__link[data-tab="active"]');
    const completedTabBtn = document.querySelector('.tab__link[data-tab="completed"]');
    const allTabBtnArr = document.querySelectorAll('.tab__link');

    allTabBtnArr.forEach(btn => btn.classList.remove('tab__link--active'));

    if (tabName === 'all') {
      allTabBtn.classList.add('tab__link--active');
    } else if (tabName === 'active') {
      activeTabBtn.classList.add('tab__link--active')
    } else if (tabName === 'completed') {
      completedTabBtn.classList.add('tab__link--active')
    }
  }

  clearTodoList() {
    const todoListAll = document.querySelector('.task-list[data-tab="all"]');
    const todoListActive = document.querySelector('.task-list[data-tab="active"]');
    const todoListCompleted = document.querySelector('.task-list[data-tab="completed"]');

    todoListAll.innerHTML = ``;
    todoListActive.innerHTML = ``;
    todoListCompleted.innerHTML = ``;
  }

  clearField() {
    const todoInput = document.querySelector('.js-todoInput');

    todoInput.value = '';
  }

  // Todo Events
  onAddTodo(handler) {
    const addForm = document.querySelector('.js-addForm');

    addForm.addEventListener('submit', e => {
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
    const taskGroup = document.querySelector('.js-taskGroup');

    taskGroup.addEventListener('click', e => {
      e.preventDefault();

      if (e.target.classList.contains('js-checkbox')) {
        const todoElement = e.target.parentElement.parentElement.parentElement;
        const todoId = e.target.parentElement.parentElement.parentElement.getAttribute('data-id');

        handler(todoId);

        this.updateTodo(todoElement);
      }
    });
  }

  onDeleteTodo(handler) {
    const todoListCompleted = document.querySelector('.task-list[data-tab="completed"]');

    todoListCompleted.addEventListener('click', e => {
      e.preventDefault();

      if (e.target.classList.contains('js-delete')) {
        const todoElement = e.target.parentElement;
        const todoId = e.target.parentElement.getAttribute('data-id');

        handler(todoId);

        this.deleteTodo(todoElement)
      }
    });
  }

  onDeleteAllTodo(handler) {
    const deleteAllBtn = document.querySelector('.js-deleteAll');

    deleteAllBtn.addEventListener('click', e => {
      e.preventDefault();

      handler();

      this.clearTodoList();
    });
  }

  // Tab Events
  onAllTabClick(handler) {
    const allTabBtn = document.querySelector('.tab__link[data-tab="all"]');

    allTabBtn.addEventListener('click', e => {
      const todoList = handler('all');

      this.setActiveTab('all');
      this.clearTodoList();
      this.renderTodo(todoList, 'all');
      this.renderDefaultUI();
    });
  }

  onActiveTabClick(handler) {
    const activeTabBtn = document.querySelector('.tab__link[data-tab="active"]');

    activeTabBtn.addEventListener('click', e => {
      const todoList = handler('active');

      this.setActiveTab('active');
      this.clearTodoList();
      this.renderTodo(todoList, 'active');
      this.renderDefaultUI();
    });
  }

  onCompletedTabClick(handler) {
    const completedTabBtn = document.querySelector('.tab__link[data-tab="completed"]');

    completedTabBtn.addEventListener('click', e => {
      const todoList = handler('completed');

      this.setActiveTab('completed');
      this.clearTodoList();
      this.renderTodo(todoList, 'completed');
      this.renderCompletedUI();
    });
  }

  // Render Elements
  renderTodo(todoList, tabName) {
    const todoListAll = document.querySelector('.task-list[data-tab="all"]');
    const todoListActive = document.querySelector('.task-list[data-tab="active"]');
    const todoListCompleted = document.querySelector('.task-list[data-tab="completed"]');

    todoList.forEach(task => {
      const todo = this.createTodo(task);

      if (tabName === 'all') {
        todoListAll.append(todo);
      } else if (tabName === 'active') {
        todoListActive.append(todo);
      } else if (tabName === 'completed') {
        todoListCompleted.append(todo);
      }
    });
  }

  renderNewTodo(newTodo) {
    const todo = this.createTodo(newTodo);
    const activeTab = document.querySelector('.tab__link--active').getAttribute('data-tab');
    const todoListAll = document.querySelector('.task-list[data-tab="all"]');
    const todoListActive = document.querySelector('.task-list[data-tab="active"]');
    
    if (activeTab === 'all') {
      todoListAll.append(todo);
    } else if (activeTab === 'active') {
      todoListActive.append(todo);
    }
  }

  renderDefaultUI() {
    const addForm = document.querySelector('.js-addForm');
    const deleteAllBtn = document.querySelector('.js-deleteAll');

    addForm.classList.remove('add-task--hidden');

    deleteAllBtn.classList.remove('btn__delete-all--visible');
  }

  renderCompletedUI() {
    const addForm = document.querySelector('.js-addForm');
    const todoListBtn = document.querySelectorAll('.js-delete');
    const deleteAllBtn = document.querySelector('.js-deleteAll');

    addForm.classList.add('add-task--hidden');

    todoListBtn.forEach(task => {
      task.classList.add('btn__delete--visible');
    });

    deleteAllBtn.classList.add('btn__delete-all--visible');
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
  }

  getTodo(todoType) {
    return this.model.getTodo(todoType);
  }

  handleEventListeners() {
    this.view.onAddTodo(this.handleAddTodo);
    this.view.onCheckboxClick(this.handleCheckboxClick);
    this.view.onDeleteTodo(this.handleDeleteTodo);
    this.view.onDeleteAllTodo(this.handleDeleteAllTodo);
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

  handleDeleteTodo = todoId => {
    this.model.deleteTodo(todoId);
  }

  handleDeleteAllTodo = () => {
    this.model.deleteAllTodo();
  }

  handleOnTabClick = todoType => {
    return this.model.getTodo(todoType);
  }

  init() {
    this.view.init(this.getTodo('all'));
    this.handleEventListeners();
  }
}

const todo = new TodoController(new TodoModel(), new TodoView());

todo.init();