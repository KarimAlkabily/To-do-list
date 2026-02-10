// Tasks array loaded from LocalStorage
let tasks = JSON.parse(localStorage.getItem("ramadan_tasks")) || [];
let currentEditId = null;

const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const addBtn = document.getElementById("addBtn");
const editModal = document.getElementById("editModal");
const editInput = document.getElementById("editInput");

// Render tasks when the page loads
renderTasks();

// Function to add a new task
function addTask() {
  const text = taskInput.value.trim();
  if (text === "") return;

  const newTask = {
    id: Date.now(),
    text: text,
    completed: false,
  };

  tasks.unshift(newTask); // Add task to the beginning of the list
  taskInput.value = "";
  saveAndRender();
}

// Function to render tasks on the screen
function renderTasks() {
  taskList.innerHTML = "";

  if (tasks.length === 0) {
    document.getElementById("emptyState").style.display = "block";
  } else {
    document.getElementById("emptyState").style.display = "none";
    tasks.forEach((task) => {
      const li = document.createElement("li");
      li.className = `task-item ${task.completed ? "completed" : ""}`;
      li.innerHTML = `
                <span onclick="toggleTask(${task.id})" style="cursor:pointer; flex:1;">${task.text}</span>
                <div class="actions">
                    <button onclick="toggleTask(${task.id})" title="Done">✔️</button>
                    <button onclick="openEdit(${task.id}, '${task.text}')" title="Edit">✏️</button>
                    <button onclick="deleteTask(${task.id})" title="Delete">🗑️</button>
                </div>
            `;
      taskList.appendChild(li);
    });
  }
  updateStats();
}

// Toggle task status (completed / not completed)
function toggleTask(id) {
  tasks = tasks.map((t) =>
    t.id === id ? { ...t, completed: !t.completed } : t,
  );
  saveAndRender();
}

// Delete a task
function deleteTask(id) {
  tasks = tasks.filter((t) => t.id !== id);
  saveAndRender();
}

// Open edit modal
function openEdit(id, text) {
  currentEditId = id;
  editInput.value = text;
  editModal.style.display = "flex";
}

// Save edited task
document.getElementById("saveEditBtn").onclick = () => {
  const newText = editInput.value.trim();
  if (newText) {
    tasks = tasks.map((t) =>
      t.id === currentEditId ? { ...t, text: newText } : t,
    );
    closeModal();
    saveAndRender();
  }
};

function closeModal() {
  editModal.style.display = "none";
}

document.getElementById("cancelEditBtn").onclick = closeModal;

// Update statistics
function updateStats() {
  const total = tasks.length;
  const done = tasks.filter((t) => t.completed).length;
  document.getElementById("total-count").innerText = total;
  document.getElementById("completed-count").innerText = done;
  document.getElementById("remaining-count").innerText = total - done;
}

// Save tasks to LocalStorage and re-render
function saveAndRender() {
  localStorage.setItem("ramadan_tasks", JSON.stringify(tasks));
  renderTasks();
}

// Click events
addBtn.onclick = addTask;
taskInput.onkeydown = (e) => {
  if (e.key === "Enter") addTask();
};
