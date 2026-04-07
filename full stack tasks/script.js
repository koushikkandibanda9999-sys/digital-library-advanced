window.onload = loadTasks;

function addTask() {
  let input = document.getElementById("taskInput");
  let task = input.value.trim();

  if (task === "") {
    alert("Enter task");
    return;
  }

  createTask(task);
  saveTask(task);
  input.value = "";
}

function createTask(taskText) {
  let li = document.createElement("li");

  let span = document.createElement("span");
  span.innerText = taskText;

  span.onclick = function () {
    span.classList.toggle("completed");
  };

  let delBtn = document.createElement("button");
  delBtn.innerText = "X";
  delBtn.className = "delete-btn";

  delBtn.onclick = function () {
    li.remove();
    deleteTask(taskText);
  };

  li.appendChild(span);
  li.appendChild(delBtn);

  document.getElementById("taskList").appendChild(li);
}

function saveTask(task) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach(task => createTask(task));
}

function deleteTask(taskText) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.filter(task => task !== taskText);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function toggleDarkMode() {
  document.body.classList.toggle("dark");
}