document.addEventListener("DOMContentLoaded", () => {
    loadTasks();
    loadTheme();
    updateNotificationBadge();
});

// Add a New Task
function addTask() {
    let taskInput = document.getElementById("taskInput").value.trim();
    let taskDate = document.getElementById("taskDate").value;
    let taskPriority = document.getElementById("taskPriority").value;
    let taskCategory = document.getElementById("taskCategory").value;

    if (taskInput === "") {
        alert("Task cannot be empty!");
        return;
    }

    let li = document.createElement("li");
    li.classList.add(taskPriority);
    li.innerHTML = `
        <span>${taskInput} <small>(${taskDate ? taskDate : "No Due Date"})</small> 
        <span class="category">[${taskCategory.toUpperCase()}]</span></span>
        <input type="number" min="0" max="100" value="0" class="task-progress" onchange="updateProgress(this)">
        <div class="progress-container">
            <div class="progress-bar"></div>
        </div>
        <button class="edit-btn" onclick="editTask(this)">✏️</button>
        <button onclick="removeTask(this)">❌</button>
    `;

    document.getElementById("taskList").appendChild(li);
    saveTasks();
    updateNotificationBadge();
}

// Remove Task
function removeTask(button) {
    button.parentElement.remove();
    saveTasks();
    updateNotificationBadge();
}

// Edit Task
function editTask(button) {
    let newText = prompt("Edit your task:", button.previousElementSibling.innerText);
    if (newText !== null && newText.trim() !== "") {
        button.previousElementSibling.innerText = newText.trim();
        saveTasks();
    }
}

// Clear All Tasks
function clearTasks() {
    document.getElementById("taskList").innerHTML = "";
    localStorage.removeItem("tasks");
    updateNotificationBadge();
}

// Update Progress
function updateProgress(input) {
    let progressBar = input.nextElementSibling.firstElementChild;
    progressBar.style.width = input.value + "%";
    saveTasks();
}

// Save Tasks to Local Storage
function saveTasks() {
    let tasks = [];
    document.querySelectorAll("#taskList li").forEach(li => {
        tasks.push({
            text: li.querySelector("span").innerText,
            priority: li.classList.contains("low") ? "low" : li.classList.contains("medium") ? "medium" : "high",
            category: li.querySelector(".category").innerText.replace("[", "").replace("]", ""),
            progress: li.querySelector(".task-progress").value
        });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load Tasks from Local Storage
function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let taskList = document.getElementById("taskList");

    tasks.forEach(task => {
        let li = document.createElement("li");
        li.classList.add(task.priority);

        li.innerHTML = `
            <span>${task.text}</span>
            <input type="number" min="0" max="100" value="${task.progress}" class="task-progress" onchange="updateProgress(this)">
            <div class="progress-container">
                <div class="progress-bar" style="width: ${task.progress}%"></div>
            </div>
            <button class="edit-btn" onclick="editTask(this)">✏️</button>
            <button onclick="removeTask(this)">❌</button>
        `;
        taskList.appendChild(li);
    });

    updateNotificationBadge();
}

// Update Notification Badge
function updateNotificationBadge() {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let dueTasks = tasks.filter(task => !task.completed).length;
    let notificationBadge = document.getElementById("notificationBadge");

    notificationBadge.textContent = dueTasks;
    notificationBadge.style.display = dueTasks > 0 ? "block" : "none";
}

// Dark Mode Toggle
function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
}

// Load Dark Mode Preference
function loadTheme() {
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
    }
}
