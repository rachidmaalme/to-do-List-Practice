document.addEventListener("DOMContentLoaded", () => {
    loadTasks();
    loadTheme();
});

// Sound Effects
const addSound = new Audio("https://www.fesliyanstudios.com/play-mp3/4381");
const deleteSound = new Audio("https://www.fesliyanstudios.com/play-mp3/4383");

function addTask() {
    let taskInput = document.getElementById("taskInput");
    let taskDate = document.getElementById("taskDate");
    let taskText = taskInput.value.trim();
    let dueDate = taskDate.value;

    if (taskText === "") {
        alert("Task cannot be empty!");
        return;
    }

    let taskList = document.getElementById("taskList");

    let li = document.createElement("li");
    li.innerHTML = `
        <span onclick="toggleTask(this)">${taskText} 
        <small style="color:gray;">(${dueDate ? dueDate : "No Due Date"})</small></span>
        <button class="edit-btn" onclick="editTask(this)">✏️</button>
        <button onclick="removeTask(this)">❌</button>
    `;

    taskList.appendChild(li);
    saveTasks();
    addSound.play();  // Play add sound effect
    taskInput.value = "";
    taskDate.value = "";
}

function removeTask(button) {
    button.parentElement.remove();
    saveTasks();
    deleteSound.play();  // Play delete sound effect
}

function toggleTask(span) {
    span.classList.toggle("completed");
    saveTasks();
}

function editTask(button) {
    let newText = prompt("Edit your task:", button.previousElementSibling.innerText);
    if (newText !== null && newText.trim() !== "") {
        button.previousElementSibling.innerText = newText.trim();
        saveTasks();
    }
}

function clearTasks() {
    document.getElementById("taskList").innerHTML = "";
    localStorage.removeItem("tasks");
}

function saveTasks() {
    let tasks = [];
    document.querySelectorAll("#taskList li").forEach(li => {
        tasks.push({
            text: li.querySelector("span").innerText,
            completed: li.querySelector("span").classList.contains("completed")
        });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let taskList = document.getElementById("taskList");

    tasks.forEach(task => {
        let li = document.createElement("li");
        li.innerHTML = `
            <span onclick="toggleTask(this)" class="${task.completed ? 'completed' : ''}">${task.text}</span>
            <button class="edit-btn" onclick="editTask(this)">✏️</button>
            <button onclick="removeTask(this)">❌</button>
        `;
        taskList.appendChild(li);
    });
}

// Dark Mode Functionality
function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
    let theme = document.body.classList.contains("dark-mode") ? "dark" : "light";
    localStorage.setItem("theme", theme);
}

function loadTheme() {
    let savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
    }
}
