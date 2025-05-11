document.addEventListener("DOMContentLoaded", () => {
    loadTasks();
    loadTheme();
    enableDragAndDrop();
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

    let taskList = document.getElementById("taskList");
    let li = document.createElement("li");
    li.classList.add(taskPriority, "draggable");
    li.setAttribute("draggable", "true");

    li.innerHTML = `
        <span onclick="toggleTask(this)">
            ${taskInput} <small>(${taskDate ? taskDate : "No Due Date"})</small> 
            <span class="category">[${taskCategory.toUpperCase()}]</span>
        </span>
        <button class="edit-btn" onclick="editTask(this)">✏️</button>
        <button onclick="removeTask(this)">❌</button>
    `;

    taskList.appendChild(li);
    saveTasks();
    enableDragAndDrop();

    // Clear input fields
    document.getElementById("taskInput").value = "";
    document.getElementById("taskDate").value = "";
}

// Remove a Task
function removeTask(button) {
    button.parentElement.remove();
    saveTasks();
}

// Mark Task as Completed
function toggleTask(span) {
    span.classList.toggle("completed");
    saveTasks();
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
}

// Save Tasks to Local Storage
function saveTasks() {
    let tasks = [];
    document.querySelectorAll("#taskList li").forEach(li => {
        tasks.push({
            text: li.querySelector("span").innerText,
            priority: li.classList.contains("low") ? "low" : li.classList.contains("medium") ? "medium" : "high",
            category: li.querySelector(".category").innerText.replace("[", "").replace("]", ""),
            completed: li.querySelector("span").classList.contains("completed")
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
        li.classList.add(task.priority, "draggable");
        li.setAttribute("draggable", "true");

        li.innerHTML = `
            <span onclick="toggleTask(this)" class="${task.completed ? 'completed' : ''}">
                ${task.text} <small>(${task.dueDate ? task.dueDate : "No Due Date"})</small>
                <span class="category">[${task.category}]</span>
            </span>
            <button class="edit-btn" onclick="editTask(this)">✏️</button>
            <button onclick="removeTask(this)">❌</button>
        `;
        taskList.appendChild(li);
    });

    enableDragAndDrop();
}

// Dark Mode Toggle
function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
    let theme = document.body.classList.contains("dark-mode") ? "dark" : "light";
    localStorage.setItem("theme", theme);
}

// Load Dark Mode Preference
function loadTheme() {
    let savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
    }
}

// Enable Drag & Drop Sorting
function enableDragAndDrop() {
    let tasks = document.querySelectorAll(".draggable");

    tasks.forEach(task => {
        task.addEventListener("dragstart", () => {
            task.classList.add("dragging");
        });

        task.addEventListener("dragend", () => {
            task.classList.remove("dragging");
            saveTasks(); // Save new order
        });
    });

    let taskList = document.getElementById("taskList");
    taskList.addEventListener("dragover", (e) => {
        e.preventDefault();
        const afterElement = getDragAfterElement(taskList, e.clientY);
        const draggingTask = document.querySelector(".dragging");
        if (afterElement == null) {
            taskList.appendChild(draggingTask);
        } else {
            taskList.insertBefore(draggingTask, afterElement);
        }
    });
}

// Helper function for Drag & Drop Sorting
function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll(".draggable:not(.dragging)")];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        return offset < 0 && offset > closest.offset ? { offset, element: child } : closest;
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// Check for Due Task Reminders
function checkTaskReminders() {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let today = new Date().toISOString().split('T')[0]; // Get today's date (YYYY-MM-DD)

    tasks.forEach(task => {
        if (task.dueDate === today && !task.completed) {
            alert(`Reminder: Task "${task.text}" is due today!`);
        }
    });
}

// Run the Reminder Check When the Page Loads
document.addEventListener("DOMContentLoaded", checkTaskReminders);


// Update Progress Bar
function updateProgress() {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let completedTasks = tasks.filter(task => task.completed).length;
    let totalTasks = tasks.length;

    let progressPercentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
    
    document.getElementById("progressText").innerText = `${progressPercentage}%`;
    document.getElementById("progressFill").style.width = `${progressPercentage}%`;
}

// Update progress every time a task is added, removed, or completed
document.addEventListener("DOMContentLoaded", updateProgress);

// Change Theme Color
function changeThemeColor() {
    let color = document.getElementById("themeColor").value;
    document.body.style.backgroundColor = color;
    localStorage.setItem("themeColor", color);
}

// Load Saved Theme Color
function loadThemeColor() {
    let savedColor = localStorage.getItem("themeColor");
    if (savedColor) {
        document.body.style.backgroundColor = savedColor;
        document.getElementById("themeColor").value = savedColor;
    }
}

// Load theme color when the page loads
document.addEventListener("DOMContentLoaded", loadThemeColor);
