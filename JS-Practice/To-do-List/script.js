function addTask() {
    let taskInput = document.getElementById("taskInput");
    let taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Task cannot be empty!");
        return;
    }

    let taskList = document.getElementById("taskList");

    // Create a new list item
    let li = document.createElement("li");
    li.innerHTML = `
        <span onclick="toggleTask(this)">${taskText}</span>
        <button onclick="removeTask(this)">❌</button>
    `;

    taskList.appendChild(li);
    taskInput.value = "";
}



function removeTask(button) {
    button.parentElement.remove();
}

function toggleTask(span) {
    span.classList.toggle("completed");
}
