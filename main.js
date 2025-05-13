//////////// title ////////// 
const titleInput = document.getElementById("planTitle");
const dateDisplay = document.getElementById("dateDisplay");


const savedTitle = localStorage.getItem("weeklyPlanTitle");
if (savedTitle) titleInput.value = savedTitle;


titleInput.addEventListener("input", () => {
    localStorage.setItem("weeklyPlanTitle", titleInput.value);
});


const today = new Date();
const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
dateDisplay.textContent = today.toLocaleDateString('en-US', options);





//////////// todo task ////////// 

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const clearAllBtn = document.getElementById("clearAllBtn");
const taskCounter = document.getElementById("taskCounter");


function renderTasks() {
    clearAllBtn.style.display = tasks.length > 0 ? "inline-block" : "none";

    taskList.innerHTML = "";
    tasks.forEach((task, index) => {
        const li = document.createElement("li");
        li.className = "task-item" + (task.done ? " completed" : "");

        li.innerHTML = `
  <div>
   <label class="custom-checkbox">
    <input type="checkbox" ${task.done ? "checked" : ""} onchange="toggleTask(${index})">
	  <span class="checkmark"></span>
    <span  id="taskText-${index}" class="task-text">${task.text}</span>
	</label>
    <input type="text" id="editInput-${index}" class="edit-input line-input" value="${task.text}" style="display: none;">
  </div>
  <div>

   
	    <button style="background: #5d9f7c;" onclick="startEdit(${index})" id="editBtn-${index}">Edit</button>

    <button style="background: #cb3b25c7;" onclick="deleteTask(${index})">Delete</button>
  </div>
`;


        taskList.appendChild(li);
    });
    updateCounter();
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {
    const text = taskInput.value.trim();
    if (text) {
        tasks.push({ text, done: false });
        taskInput.value = "";
        renderTasks();
    }
}


function startEdit(index) {
    const textEl = document.getElementById(`taskText-${index}`);
    const inputEl = document.getElementById(`editInput-${index}`);
    const btn = document.getElementById(`editBtn-${index}`);

    if (btn.textContent === "Edit") {
        textEl.style.display = "none";
        inputEl.style.display = "inline";
        btn.textContent = "Save";
        inputEl.focus();
    } else {
        const newText = inputEl.value.trim();
        if (newText) {
            tasks[index].text = newText;
            renderTasks();
        }
    }
}



function deleteTask(index) {
    tasks.splice(index, 1);
    renderTasks();
}

function clearAllTasks() {
    tasks = [];
    renderTasks();
}

function toggleTask(index) {
    tasks[index].done = !tasks[index].done;
    renderTasks();
}

function editTask(index, newText) {
    tasks[index].text = newText.trim();
    renderTasks();
}

function updateCounter() {
    const remaining = tasks.filter(task => !task.done).length;
    taskCounter.textContent = `${remaining} To-Do`;
}

addTaskBtn.addEventListener("click", addTask);
clearAllBtn.addEventListener("click", clearAllTasks);
taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addTask();
});

renderTasks();

//////////// Day task ////////// 


const days = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];
const daysContainer = document.getElementById("daysContainer");


days.forEach(day => {
    const section = document.createElement("div");
    section.className = "day-section";

    section.innerHTML = `
        <h3>${day}</h3>
        <div class="tasks-container" id="tasks-${day}"></div>
        <input class="line-input" id="input-${day}" placeholder="your plan" onkeydown="handleAdd(event, '${day}')">
      `;

    daysContainer.appendChild(section);
    loadTasks(day);
});

function saveTasks(day) {
    const container = document.getElementById(`tasks-${day}`);
    const inputs = container.querySelectorAll("input");
    const values = Array.from(inputs).map(input => input.value);
    localStorage.setItem(`tasks-${day}`, JSON.stringify(values));
}

function loadTasks(day) {
    const saved = localStorage.getItem(`tasks-${day}`);
    if (saved) {
        const tasks = JSON.parse(saved);
        tasks.forEach(task => createTask(day, task));
    }
}

function createTask(day, text = "") {
    const container = document.getElementById(`tasks-${day}`);
    const tag = document.createElement("div");
    tag.className = "tag";

    const taskInput = document.createElement("input");
    taskInput.type = "text";
    taskInput.value = text;
    taskInput.addEventListener("input", () => saveTasks(day));
    taskInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") taskInput.blur();
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = "×";
    deleteBtn.onclick = () => {
        tag.remove();
        saveTasks(day);
    };

    tag.appendChild(taskInput);
    tag.appendChild(deleteBtn);
    container.appendChild(tag);
}

function handleAdd(e, day) {
    if (e.key === "Enter" && e.target.value.trim() !== "") {
        createTask(day, e.target.value.trim());
        e.target.value = "";
        saveTasks(day);
    }
}