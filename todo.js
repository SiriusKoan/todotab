var numberOfTodos = 0;

const todoForm = document.querySelector('#todo-form');
todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const todoTitle = document.querySelector('#todo-title');
    const todoDeadline = document.querySelector('#todo-deadline');
    chrome.storage.local.get(['todos'], function (result) {
        let todos = result.todos || [];
        todos.push({ "title": todoTitle.value, "deadline": todoDeadline.value });
        chrome.storage.local.set({ todos: todos }, function () {
            console.log(`Todo ${todoTitle.value} saved`);
            // reset input
            todoTitle.value = '';
            todoDeadline.value = '';
        });
        renderTodo(todoTitle.value, todoDeadline.value);
    });
});


function renderTodos() {
    chrome.storage.local.get(['todos'], function (result) {
        let todos = result.todos || [];
        todos.forEach(todo => {
            renderTodo(todo.title, todo.deadline);
        });
    });
}

function deleteTodo(e) {
    const todoItem = e.target.parentElement;
    console.log(todoItem);
    const todoId = todoItem.todo_id;
    chrome.storage.local.get(['todos'], function (result) {
        let todos = result.todos || [];
        todos.splice(todoId, 1);
        chrome.storage.local.set({ todos: todos }, function () {
            console.log(`Todo ${todoId} deleted`);
            console.log(todoItem.parentElement);
            todoItem.parentElement.remove();
        });
    });
}

function renderTodo(title, deadline) {
    const todoContainer = document.querySelector('#todo-container');
    const todoDiv = document.createElement('div');
    todoDiv.classList.add('todo-item');
    // delete btn
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-btn");
    deleteButton.classList.add("todo-delete-btn");
    const icon = document.createElement("i");
    icon.classList.add("fas");
    icon.classList.add("fa-trash");
    deleteButton.appendChild(icon);
    deleteButton.todo_id = numberOfTodos;
    deleteButton.addEventListener("click", deleteTodo);
    todoDiv.appendChild(deleteButton);
    // title
    const titleSpan = document.createElement('span');
    titleSpan.classList.add('todo-title');
    titleSpan.textContent = title;
    todoDiv.appendChild(titleSpan);
    if (deadline) {
        // deadline
        const deadlineSpan = document.createElement('span');
        deadlineSpan.classList.add('todo-deadline');
        deadlineSpan.textContent = deadline;
        // category
        const today = new Date();
        const deadlineDate = new Date(deadline);
        const timeDiff = deadlineDate.getTime() - today.getTime();
        const dayDiff = timeDiff / (1000 * 3600 * 24);
        if (dayDiff < 0) {
            deadlineSpan.classList.add('todo-overdue');
        }
        else if (dayDiff <= 1) {
            deadlineSpan.classList.add('todo-urgent');
        }
        else if (dayDiff <= 3) {
            deadlineSpan.classList.add('todo-warning');
        }
        else {
            deadlineSpan.classList.add('todo-normal');
        }
        todoDiv.appendChild(deadlineSpan);
    }

    todoContainer.appendChild(todoDiv);
    numberOfTodos++;
}
